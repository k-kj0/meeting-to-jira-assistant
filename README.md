# Meeting-to-Issue

Turn meeting commitments into GitHub Issues.

Paste a meeting transcript. An LLM extracts only the explicit, actionable
commitments — a named owner, a concrete action, and (if stated) a deadline —
lets you review them, and files the ones you approve as real GitHub Issues
with one click.

**Stack:** Python (Vercel serverless functions) · OpenRouter · GitHub REST API

No Jira, no Flask app, no server to run — this is two stateless Python
functions behind a static HTML page.

## How it works

```
Meeting transcript
        │  POST
        ▼
/api/extract  (Vercel function)
        │  sends transcript + system prompt to OpenRouter
        ▼
OpenRouter (free open-weight model)
        │  returns structured JSON: task, assignee, deadline
        ▼
Human review (in the browser)
        │  POST for each approved item
        ▼
/api/create-ticket  (Vercel function)
        │  opens a real GitHub Issue via the GitHub API
        ▼
GitHub Issue (link shown back to you)
```

The extraction prompt is deliberately narrow: it keeps a sentence only if it
names an owner and a committed action, and drops vague language ("we should
probably...", "maybe circle back on...") rather than turning discussion into
fake tasks. That's the actual design decision worth defending in an
interview, not the choice of LLM.

## Example

Input:
```
Alice will fix the authentication bug by Friday.
Someone should probably look into caching at some point.
```

Output:
```
✔ Task: Fix authentication bug   Owner: Alice   Deadline: Friday
(second sentence dropped — no named owner, no committed action)
```

## File layout

```
/public/index.html      ← the page itself, served as a static file
/api/extract.py         ← becomes the /api/extract endpoint
/api/create-ticket.py   ← becomes the /api/create-ticket endpoint
/requirements.txt       ← shared by both functions
/.env.example
/.gitignore
```

Each file in `/api/` automatically becomes its own serverless function at
the matching URL — that's Vercel's convention for Python, not a single
`app.py` handling every route.

## Setup

### 1. Get your two keys (~5 minutes)

- **OpenRouter key** — [openrouter.ai](https://openrouter.ai), sign up with
  email (no card) → **openrouter.ai/keys** → "Create Key".
- **GitHub token** — a fine-grained personal access token
  ([github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens))
  scoped to only the one repo you'll use, with **Issues: read and write**
  permission. Avoid classic tokens with full `repo` scope for anything you're
  showing to other people — least privilege matters here.

### 2. Set Vercel environment variables

Project → Settings → Environment Variables:

| Name | Value |
|---|---|
| `OPENROUTER_API_KEY` | your OpenRouter key |
| `GITHUB_TOKEN` | your fine-grained GitHub token |
| `GITHUB_REPO` | `yourusername/your-ticket-repo` |

Then Deployments → latest → "..." → Redeploy.

### 3. Local testing (optional)

```bash
npm install -g vercel
cd meeting-to-issue
cp .env.example .env   # fill in real keys
vercel dev
```

`vercel dev` emulates the real `/api/*` routing locally — running
`python api/extract.py` directly won't work, since these files are written
to be invoked as serverless functions, not run standalone.

## Known limitations

- Extraction quality depends on the free-tier model OpenRouter routes you to
  that day; it isn't pinned to one model.
- No persistence — tickets aren't tracked once created; there's no dedupe if
  you paste the same transcript twice.
- No automated test suite yet (see Roadmap).

## Roadmap

- [ ] Pydantic schema validation on the model's JSON output instead of
      trusting it directly
- [ ] Test fixtures for: valid commitment, no owner, vague suggestion,
      multiple commitments, ambiguous deadline
- [ ] GitHub Actions CI (lint + tests on every push)
- [ ] Optional Jira output alongside GitHub Issues, once GitHub-only is solid

## License

MIT
