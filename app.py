import os
import json
import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()  # no-op in production on Vercel; loads .env for local dev

app = Flask(__name__, static_folder="public", static_url_path="")
CORS(app)

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
GITHUB_REPO = os.environ.get("GITHUB_REPO")  # format: "yourusername/your-repo"

# Any ":free" model works here — swap if one is rate-limited or rotated out.
# See https://openrouter.ai/models?max_price=0 for the current free list.
OPENROUTER_MODEL = "meta-llama/llama-3.1-8b-instruct:free"

SYSTEM_PROMPT = """You read meeting transcripts and extract ONLY committed action items.

Rules:
- Only include a sentence if it has a named owner AND a clear future action ("will", "is going to", "needs to").
- Skip vague suggestions ("we should probably", "maybe someone could", "circle back on").
- Respond with ONLY raw JSON, no markdown fences, no commentary, in this exact shape:
{"action_items": [{"task": "short task description", "assignee": "Name or Unassigned", "deadline": "date mentioned or null"}]}
"""


def parse_json_loose(text):
    """Free models sometimes wrap JSON in markdown fences or add stray text.
    Try a straight parse first, then fall back to slicing the first {...} block."""
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
        text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1:
            return json.loads(text[start:end + 1])
        raise


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/api/extract", methods=["POST"])
def extract():
    data = request.get_json(force=True)
    transcript = (data or {}).get("transcript", "").strip()

    if not transcript:
        return jsonify({"error": "No transcript provided"}), 400

    if not OPENROUTER_API_KEY:
        return jsonify({"error": "Server is missing OPENROUTER_API_KEY."}), 500

    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": OPENROUTER_MODEL,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": transcript},
                ],
                "temperature": 0.1,
            },
            timeout=30,
        )
        if resp.status_code >= 300:
            return jsonify({"error": f"OpenRouter API error: {resp.status_code} {resp.text}"}), 502

        raw_text = resp.json()["choices"][0]["message"]["content"]
        parsed = parse_json_loose(raw_text)
        return jsonify(parsed)
    except Exception as e:
        return jsonify({"error": f"Extraction failed: {str(e)}"}), 500


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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
