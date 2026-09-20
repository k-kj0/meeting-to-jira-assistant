# Meeting-to-Jira Assistant (real backend, Vercel + OpenRouter)

Paste a meeting transcript, an AI model extracts committed action items (task, assignee, deadline), and you turn each one into a real GitHub Issue with one click.

- **Extraction:** OpenRouter free tier (no card, no Groq) — a free open-weight model
- **Tickets:** GitHub Issues in a repo you choose (no Atlassian/Jira setup)
- **Hosting:** Vercel Hobby (free, no card) — one function per API route, which is how Vercel actually expects Python code to be laid out

## File layout

```
/public/index.html      ← the page itself, served as a static file
/api/extract.py         ← becomes the /api/extract endpoint
/api/create-ticket.py   ← becomes the /api/create-ticket endpoint
/requirements.txt       ← shared by both functions
/.env.example
/.gitignore
```

Each file in `/api/` automatically becomes its own serverless function at the matching URL — that's Vercel's actual convention, not a single `app.py` handling every route.

## 1. Get your two keys (~5 minutes)

**OpenRouter key** — openrouter.ai, sign up with email (no card) → openrouter.ai/keys → "Create Key".

**GitHub token** — github.com/settings/tokens → "Generate new token (classic)" → check the `repo` scope → Generate → copy immediately.

## 2. Set Vercel environment variables

Project → Settings → Environment Variables → add all three, exactly named:

| Name | Value |
|---|---|
| `OPENROUTER_API_KEY` | your OpenRouter key |
| `GITHUB_TOKEN` | your GitHub token |
| `GITHUB_REPO` | `yourusername/your-ticket-repo` |

Then Deployments → latest → "..." → Redeploy, so the new structure and variables both take effect.

## 3. Local testing (optional)

```bash
npm install -g vercel
cd meeting-to-jira-assistant
cp .env.example .env   # fill in real keys
vercel dev
```

`vercel dev` emulates the real `/api/*` routing locally — a plain `python api/extract.py` won't, since these files are written to be invoked as serverless functions, not run standalone.

## How it works

1. You paste a transcript and click "Extract action items."
2. The page calls `POST /api/extract`, which sends the transcript to OpenRouter with a system prompt that only keeps sentences with a named owner and a committed action.
3. The model returns structured JSON (`task`, `assignee`, `deadline`), rendered as a list of tickets. (Free models occasionally wrap JSON in markdown fences — `extract.py` strips that before parsing.)
4. Clicking "Create ticket" calls `POST /api/create-ticket`, which opens a real GitHub Issue in your configured repo and shows you the link.

## License

MIT
