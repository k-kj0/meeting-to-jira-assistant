# Meeting-to-Jira Assistant (Prototype)

A frontend prototype exploring an idea: turning meeting transcript text into draft ticket suggestions.

**Live:** meeting-to-jira-assistant.vercel.app

## What this actually is

A static HTML/CSS/JS page. There is no backend, no Jira API connection, and no LLM call. All "extraction" runs client-side in the browser using simple keyword matching:

- Splits pasted text into sentences
- Flags a sentence as a possible action item if it contains a commitment phrase ("will", "needs to", "is responsible for", etc.)
- Skips sentences containing vague-language phrases ("maybe", "should probably", "circle back")
- Pulls a name from the start of the sentence as a guessed assignee

That's the entire logic. It does not send data anywhere, does not call Jira, and does not persist anything — everything happens in your browser tab and disappears on refresh.

## What it's for

A quick, visual demo of the concept: what would it look like if committed action items got pulled out of meeting notes automatically? It's a UI sketch of that idea, not a working integration.

## Try it

Open the live link, paste in a few lines with a name and a commitment ("Alice will fix the login bug by Friday"), and click "Extract action items." You'll see it correctly separate real commitments from vague suggestions using the keyword rules above.

## Tech stack

- Static HTML/CSS/JS, no framework
- Deployed via Docker (nginx serving static files) — see `Dockerfile` / `docker-compose.yml`

## Run locally

```bash
docker build -t meeting-to-jira .
docker run -p 80:80 meeting-to-jira
```
Or just open `index.html` directly in a browser — no server required for the current functionality.

## What would need to be built for this to be real

- A backend endpoint that actually calls an LLM (or a proper NLP library) for extraction, instead of keyword matching
- Real Jira REST API integration (OAuth, project/issue creation) — currently just a UI mockup of what that would look like
- Persistence/session handling if transcripts need to be reviewed before submission

## License

MIT
