import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
GITHUB_REPO = os.environ.get("GITHUB_REPO")  # format: "yourusername/your-repo"


@app.route("/api/create-ticket", methods=["POST"])
def create_ticket():
    data = request.get_json(force=True)
    task = (data or {}).get("task", "").strip()
    assignee = (data or {}).get("assignee", "Unassigned")
    deadline = (data or {}).get("deadline")

    if not task:
        return jsonify({"error": "No task provided"}), 400

    if not GITHUB_TOKEN or not GITHUB_REPO:
        return jsonify({"error": "Server is missing GITHUB_TOKEN or GITHUB_REPO."}), 500

    body_lines = [f"**Assignee (from transcript):** {assignee}"]
    if deadline and deadline != "null":
        body_lines.append(f"**Deadline (from transcript):** {deadline}")
    body_lines.append("\n_Created automatically from a meeting transcript._")

    payload = {
        "title": task,
        "body": "\n".join(body_lines),
        "labels": ["action-item"],
    }

    url = f"https://api.github.com/repos/{GITHUB_REPO}/issues"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
    }

    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=10)
        if resp.status_code >= 300:
            return jsonify({"error": f"GitHub API error: {resp.status_code} {resp.text}"}), 502
        issue_data = resp.json()
        return jsonify({"url": issue_data.get("html_url")})
    except Exception as e:
        return jsonify({"error": f"Ticket creation failed: {str(e)}"}), 500
