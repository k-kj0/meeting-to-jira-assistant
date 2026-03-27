import os
import re
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/process", methods=["POST"])
def process_transcript():
    data = request.get_json(silent=True) or {}
    transcript = (data.get("transcript") or "").strip()

    if not transcript:
        return jsonify({"error": "No transcript provided."}), 400

    # Extract action items using simple pattern matching
    tickets = extract_action_items(transcript)
    
    if not tickets:
        return jsonify({"error": "No action items could be extracted from the transcript."}), 400

    return jsonify({
        "success": True, 
        "demo": True,
        "tickets": tickets,
        "message": "Demo mode - Add Jira credentials to create real tickets."
    })


def extract_action_items(transcript):
    """Extract action items from transcript using keyword matching"""
    # Split into sentences
    sentences = re.split(r'[.!?]+', transcript)
    
    # Keywords that indicate action items
    keywords = ['will', 'need to', 'must', 'should', 'fix', 'update', 
                'create', 'schedule', 'review', 'implement', 'investigate', 
                'build', 'deploy', 'action', 'todo']
    
    action_items = []
    
    for sentence in sentences:
        sentence = sentence.strip()
        if len(sentence) < 10:
            continue
            
        lower_sentence = sentence.lower()
        
        # Check if sentence contains action keywords
        is_action = any(keyword in lower_sentence for keyword in keywords)
        
        if is_action:
            # Try to extract person name
            person = "Team Member"
            names = ['john', 'sarah', 'mike', 'jane', 'bob', 'alice', 
                     'david', 'lisa', 'tom', 'emma', 'alex', 'maria']
            for name in names:
                if name in lower_sentence:
                    person = name.capitalize()
                    break
            
            # Create a short title
            words = sentence.split()[:8]
            short_title = ' '.join(words) + ('...' if len(words) == 8 else '')
            
            action_items.append({
                "key": f"DEMO-{len(action_items) + 1}",
                "title": f"{person}: {short_title}",
                "description": sentence,
                "url": "#"
            })
    
    # If no action items found, create a sample one
    if not action_items and len(transcript) > 20:
        action_items.append({
            "key": "DEMO-1",
            "title": "Follow up on meeting action items",
            "description": transcript[:150],
            "url": "#"
        })
    
    return action_items[:5]  # Max 5 tickets


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
