import os
import json
import requests
from flask import Flask, render_template, request, jsonify
from openai import OpenAI

app = Flask(__name__)

openai_client = OpenAI(
    api_key=os.environ.get("AI_INTEGRATIONS_OPENAI_API_KEY"),
    base_url=os.environ.get("AI_INTEGRATIONS_OPENAI_BASE_URL")
)

JIRA_DOMAIN = os.environ.get("JIRA_DOMAIN", "").rstrip("/")
JIRA_EMAIL = os.environ.get("JIRA_EMAIL")
JIRA_API_TOKEN = os.environ.get("JIRA_API_TOKEN")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/process", methods=["POST"])
def process_transcript():
    data = request.get_json(silent=True) or {}
    transcript = (data.get("transcript") or "").strip()

    if not transcript:
        return jsonify({"error": "No transcript provided."}), 400

    if not all([JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN]):
        return jsonify({"error": "Jira credentials are missing from environment variables."}), 500

    try:
        completion = openai_client.chat.completions.create(
            model="gpt-5.2",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert project manager. Analyze the meeting transcript and "
                        "extract all action items. Return a JSON object with a single key 'tickets', "
                        "which is an array of objects each having 'title' (string, concise summary) "
                        "and 'description' (string, detailed description including who, what, and deadline "
                        "if mentioned). Extract all distinct action items, max 5."
                    ),
                },
                {"role": "user", "content": transcript},
            ],
            response_format={"type": "json_object"},
        )

        result_json = json.loads(completion.choices[0].message.content)
        tickets_to_create = result_json.get("tickets", [])

        if not tickets_to_create:
            return jsonify({"error": "No action items could be extracted from the transcript."}), 400

        auth = (JIRA_EMAIL, JIRA_API_TOKEN)
        headers = {"Accept": "application/json", "Content-Type": "application/json"}

        projects_resp = requests.get(
            f"{JIRA_DOMAIN}/rest/api/2/project", headers=headers, auth=auth, timeout=10
        )
        if not projects_resp.ok:
            return jsonify({"error": f"Could not connect to Jira: {projects_resp.text}"}), 502

        projects = projects_resp.json()
        if not projects:
            return jsonify({"error": "No Jira projects found in your workspace."}), 400

        project_key = projects[0]["key"]

        types_resp = requests.get(
            f"{JIRA_DOMAIN}/rest/api/2/issuetype", headers=headers, auth=auth, timeout=10
        )
        issue_type = "Task"
        if types_resp.ok:
            valid_types = [t for t in types_resp.json() if not t.get("subtask")]
            if valid_types:
                preferred = next((t["name"] for t in valid_types if t["name"] == "Task"), None)
                issue_type = preferred or valid_types[0]["name"]

        created_tickets = []
        for ticket in tickets_to_create[:5]:
            payload = {
                "fields": {
                    "project": {"key": project_key},
                    "summary": ticket.get("title", "Action Item"),
                    "description": ticket.get("description", ""),
                    "issuetype": {"name": issue_type},
                }
            }
            issue_resp = requests.post(
                f"{JIRA_DOMAIN}/rest/api/2/issue", json=payload, headers=headers, auth=auth, timeout=10
            )
            if issue_resp.ok:
                issue_data = issue_resp.json()
                created_tickets.append({
                    "key": issue_data.get("key"),
                    "title": ticket.get("title"),
                    "description": ticket.get("description"),
                    "url": f"{JIRA_DOMAIN}/browse/{issue_data.get('key')}",
                })

        if not created_tickets:
            return jsonify({"error": "Failed to create tickets in Jira. Please check your credentials and permissions."}), 500

        return jsonify({"success": True, "tickets": created_tickets})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
