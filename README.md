# Meeting to Jira Assistant

![screenshot 1](https://github.com/user-attachments/assets/facb0672-26b7-4ced-a0a4-611084eed0cf)
![screenshot 2](https://github.com/user-attachments/assets/72386b37-783e-457a-9bd9-fd3bff450025)
![screenshot 3](https://github.com/user-attachments/assets/fa98b966-dc61-40d3-8dbc-658e2a8a84d1)
![screenshot 4](https://github.com/user-attachments/assets/568ac556-0530-4d21-971d-d74edae14a16)
![screenshot 5](https://github.com/user-attachments/assets/1db39141-3cd2-4748-b923-20fa2687cbc7)
![screenshot 6](https://github.com/user-attachments/assets/5c04db91-2666-4fd3-a299-e7996bced652)

---

A web application that converts meeting transcripts into Jira tickets automatically. Paste a transcript, and the app extracts action items and creates structured Jira tickets — no manual ticket writing required.

---

## Overview

Engineering teams and project managers lose hours every week turning meeting notes into Jira tickets. This tool eliminates that work. It reads a meeting transcript, identifies action items, and pushes formatted tickets directly to your Jira project via the REST API.

---

## How It Works

Paste your meeting transcript into the input field. The app scans the text for action items using keyword detection, structures each one into a Jira ticket format, and creates them in your project automatically. Each ticket appears as a clickable link so you can review or edit it immediately in Jira.

---

## Features

- Extracts action items from unstructured meeting text
- Creates real Jira tickets via the Jira REST API v3
- Returns clickable ticket links after creation
- Responsive UI that works on desktop and mobile
- API credentials stored securely as environment variables

---

## Tech Stack

- **Backend** — Python, Flask
- **Frontend** — HTML5, CSS3, JavaScript
- **Integration** — Jira REST API v3
- **Deployment** — Render

---

## Getting Started

### Prerequisites

- Python 3.8 or higher
- A Jira account with API access
- A Jira project to push tickets into

### Installation

```bash
git clone https://github.com/k-kjo/meeting-to-jira-assistant.git
cd meeting-to-jira-assistant
pip install -r requirements.txt
```

### Configuration

Create a `.env` file in the root of the project:

```
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_api_token_here
JIRA_PROJECT_KEY=YOUR_PROJECT_KEY
```

To get your Jira API token, go to your Atlassian account settings under Security → API tokens → Create API token.

### Running Locally

```bash
python app.py
```

The app will be available at `http://localhost:5000`.

---

## Project Structure

```
meeting-to-jira-assistant/
├── app.py                  # Flask app and Jira API logic
├── requirements.txt        # Python dependencies
├── templates/
│   └── index.html          # Frontend
├── static/
│   └── style.css           # Styles
└── .env                    # Local credentials (not committed)
```

---

## Contributing

Open an issue before submitting a pull request for major changes. Small fixes and improvements are welcome directly as PRs.

---

## License

MIT © 2025
