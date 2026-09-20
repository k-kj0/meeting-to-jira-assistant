# Meeting-to-Jira Assistant (real backend, Vercel + OpenRouter)

Paste a meeting transcript, an AI model extracts committed action items (task, assignee, deadline), and you turn each one into a real GitHub Issue with one click.

- **Extraction:** OpenRouter free tier (no card, no Groq) — a free open-weight model
- **Tickets:** GitHub Issues in a repo you choose (no Atlassian/Jira setup)
- **Hosting:** Vercel Hobby (free, no card — same place EconAgent is already deployed)

## 1. Get your two keys (~5 minutes)

**OpenRouter key**
1. Go to openrouter.ai and sign up with just an email — no card.
2. Go to openrouter.ai/keys → "Create Key". Copy it.
3. Free tier: 20 requests/min, 200/day. Plenty for this. If a model ever gets pulled from the free list, swap `OPENROUTER_MODEL` in `app.py` for another `:free` one from openrouter.ai/models?max_price=0.

**GitHub token**
1. Go to github.com/settings/tokens → "Generate new token" → "Generate new token (classic)".
2. Name it, check the `repo` scope box, click Generate. Copy it — you only see it once.
3. Create a fresh, empty repo just to hold tickets (e.g. `my-jira-tickets`). Its `owner/repo-name` is your `GITHUB_REPO` value below.

## 2. Deploy to Vercel (no Docker, no Render)

```bash
npm install -g vercel
cd meeting-to-jira-assistant
vercel login
vercel
```

Vercel auto-detects the Flask `app` in `app.py` — no `vercel.json` needed. Follow the prompts to link/create a project, then set your three secrets:

```bash
vercel env add OPENROUTER_API_KEY
vercel env add GITHUB_TOKEN
vercel env add GITHUB_REPO
```

(Or set them in the Vercel dashboard → Project → Settings → Environment Variables.)

Then deploy for real:

```bash
vercel --prod
```

You'll get a live `*.vercel.app` URL, same pattern as EconAgent.

## 3. Or run it locally first

```bash
cp .env.example .env
# edit .env with your real keys
pip install -r requirements.txt
python app.py
```

Open http://localhost:5000 — Flask serves `public/index.html` and both API routes on the same origin, so there's nothing else to configure.

## How it works

1. You paste a transcript and click "Extract action items."
2. The page calls `POST /api/extract`, which sends the transcript to OpenRouter with a system prompt that only keeps sentences with a named owner and a committed action.
3. The model returns structured JSON (`task`, `assignee`, `deadline`), rendered as a list of tickets. (Free models occasionally wrap JSON in markdown fences — `app.py` strips that before parsing.)
4. Clicking "Create ticket" calls `POST /api/create-ticket`, which opens a real GitHub Issue in your configured repo and shows you the link.

## Files

| File | Purpose |
|---|---|
| `app.py` | Flask backend — OpenRouter extraction + GitHub Issues creation |
| `public/index.html` | Frontend UI, calls the two API routes above |
| `requirements.txt` | Python dependencies |
| `.env.example` | Template for local dev — copy to `.env`; production secrets go in Vercel |
| `.gitignore` | Keeps `.env` and `.vercel` out of version control |

## License

MIT
