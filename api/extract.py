import os
import json
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")

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
