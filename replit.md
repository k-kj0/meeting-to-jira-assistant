# Meeting Transcript to Jira

A Python Flask web application that processes meeting transcripts and automatically creates Jira tickets using AI.

## Architecture

- **Backend**: Python Flask (`main.py`)
- **Frontend**: Jinja2 template (`templates/index.html`) — single-page HTML/CSS/JS UI
- **AI**: OpenAI GPT-5.2 via Replit AI Integrations (no personal API key needed)
- **Integration**: Jira REST API v2

## How It Works

1. User pastes a meeting transcript into the textarea
2. Flask sends the transcript to OpenAI which extracts action items and returns structured JSON
3. Flask calls the Jira REST API to create one ticket per action item
4. The created ticket keys and links are displayed in the UI

## Environment Variables

| Variable | Purpose |
|---|---|
| `AI_INTEGRATIONS_OPENAI_API_KEY` | Set automatically by Replit AI Integrations |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | Set automatically by Replit AI Integrations |
| `JIRA_DOMAIN` | Your Jira workspace URL (e.g. `https://yourorg.atlassian.net`) |
| `JIRA_EMAIL` | Atlassian account email |
| `JIRA_API_TOKEN` | Jira API token |

## Running

```bash
python main.py
```

Starts the Flask dev server on port 5000.

## Key Files

- `main.py` — Flask app with `/api/process` endpoint
- `templates/index.html` — Frontend UI
- `pyproject.toml` — Python dependencies (flask, requests, openai)

## Notes

- Jira credentials are not set up via the Replit integration system (user dismissed the OAuth flow). They are stored as env vars (`JIRA_DOMAIN`, `JIRA_EMAIL`, `JIRA_API_TOKEN`). If credentials change or expire, update them in the Secrets tab.
- The app picks the first Jira project automatically and uses the "Task" issue type (falls back to the first available type).
