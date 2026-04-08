import os
import re
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# ✅ Enable CORS (important for React frontend)
CORS(app)


@app.route("/")
def index():
    return render_template("index.html")


# ✅ NEW API ENDPOINT (React will use this)
@app.route("/process", methods=["POST"])
def process_api():
    data = request.get_json(silent=True) or {}
    transcript = (data.get("transcript") or "").strip()

    if not transcript:
        return jsonify({"error": "No transcript provided."}), 400

    tickets = extract_action_items(transcript)

    if not tickets:
        return jsonify({"error": "No action items found."}), 400

    # ✅ Convert to expected frontend format
    action_items = []
    for t in tickets:
        action_items.append({
            "task": t["title"],
            "assignee": "Team Member",
            "jira_link": t["url"]
        })

    return jsonify({
        "success": True,
        "action_items": action_items,
        "count": len(action_items)
    })


# (KEEP your existing route if needed)
@app.route("/api/process", methods=["POST"])
def process_transcript():
    data = request.get_json(silent=True) or {}
    transcript = (data.get("transcript") or "").strip()

    if not transcript:
        return jsonify({"error": "No transcript provided."}), 400

    tickets = extract_action_items(transcript)

    if not tickets:
        return jsonify({"error": "No action items could be extracted."}), 400

    return jsonify({
        "success": True,
        "demo": True,
        "tickets": tickets
    })


def extract_action_items(transcript):
    """Extract action items from transcript using keyword matching"""
    sentences = re.split(r'[.!?]+', transcript)

    keywords = ['will', 'need to', 'must', 'should', 'fix', 'update',
                'create', 'schedule', 'review', 'implement', 'investigate',
                'build', 'deploy', 'action', 'todo']

    action_items = []

    for sentence in sentences:
        sentence = sentence.strip()
        if len(sentence) < 10:
            continue

        lower_sentence = sentence.lower()
        is_action = any(keyword in lower_sentence for keyword in keywords)

        if is_action:
            person = "Team Member"
            names = ['john', 'sarah', 'mike', 'jane', 'bob', 'alice',
                     'david', 'lisa', 'tom', 'emma', 'alex', 'maria']

            for name in names:
                if name in lower_sentence:
                    person = name.capitalize()
                    break

            words = sentence.split()[:8]
            short_title = ' '.join(words) + ('...' if len(words) == 8 else '')

            action_items.append({
                "key": f"DEMO-{len(action_items) + 1}",
                "title": f"{person}: {short_title}",
                "description": sentence,
                "url": "#"  # Replace later with real Jira link
            })

    if not action_items and len(transcript) > 20:
        action_items.append({
            "key": "DEMO-1",
            "title": "Follow up on meeting action items",
            "description": transcript[:150],
            "url": "#"
        })

    return action_items[:5]


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
