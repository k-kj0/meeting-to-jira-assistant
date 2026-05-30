# JiraAI

Meeting transcript → structured Jira ticket generation.

## Overview

JiraAI extracts action items, owners, priorities, and due dates from meeting notes and converts them into Jira-ready tickets.

Built as a lightweight workflow automation project focused on reducing manual ticket creation after meetings.

## Features

* Transcript parsing
* Action item extraction
* Assignee detection
* Priority classification
* Due date recognition
* Jira ticket formatting
* Responsive UI

## Tech Stack

* HTML
* CSS
* JavaScript
* Docker
* GitHub

## Docker

Build image:

```bash
docker build -t jiraai .
```

Run container:

```bash
docker run -p 80:80 jiraai
```

Using Docker Compose:

```bash
docker compose up --build
```

## Project Structure

```text
.
├── index.html
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Author

Kavya Jaiswal
