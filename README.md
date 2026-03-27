# 🎙️ Meeting to Jira Assistant

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_App-0052CC?style=for-the-badge&logo=render)](https://meeting-to-jira-assistant.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/GitHub-View_Code-181717?style=for-the-badge&logo=github)](https://github.com/k-kjo/meeting-to-jira-assistant)

> **AI-powered web application that automatically converts meeting transcripts into Jira tickets**

## 🌐 Live Demo

**Try it now:** [https://meeting-to-jira-assistant.onrender.com](https://meeting-to-jira-assistant.onrender.com)

## 📋 Overview

This tool solves a real problem engineers and project managers face daily: manually creating Jira tickets from meeting notes. Simply paste your meeting transcript, and the app extracts action items and creates formatted Jira tickets automatically.

### How It Works

1. **Paste** your meeting transcript
2. **Analyze** - AI extracts action items using keyword detection
3. **Generate** - Creates formatted Jira tickets
4. **View** - Clickable ticket links for easy access

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📝 **Smart Extraction** | Detects action items using natural language processing |
| 🔗 **Jira Integration** | Creates real tickets via Jira REST API |
| 🎨 **Clean UI** | Professional design with Jira color scheme |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |
| ⚡ **Fast Processing** | Instant ticket generation |
| 🔒 **Secure** | API tokens stored securely as environment variables |

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Python, Flask |
| **Frontend** | HTML5, CSS3, JavaScript |
| **API** | Jira REST API v3 |
| **Deployment** | Render |
| **Version Control** | Git, GitHub |

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Jira account with API access

### Installation

```bash
# Clone the repository
git clone https://github.com/k-kjo/meeting-to-jira-assistant.git
cd meeting-to-jira-assistant

# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py

## 📸 Screenshots

### Main Interface
![Main Interface](https://via.placeholder.com/800x400?text=Meeting+to+Jira+Assistant+UI)

### Ticket Generation
![Ticket Generation](https://via.placeholder.com/800x400?text=Generated+Jira+Tickets)

> **Note:** Add actual screenshots of your app here. Take screenshots of your live app at [https://meeting-to-jira-assistant.onrender.com](https://meeting-to-jira-assistant.onrender.com)

🎯 Use Cases
Daily Standups - Convert team updates into action items

Client Meetings - Track client requests and commitments

Sprint Planning - Create tickets directly from planning sessions

Bug Triage - Extract bug reports from meetings

📁 Project Structure
text
meeting-to-jira-assistant/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── README.md             # Documentation
├── templates/
│   └── index.html        # Frontend UI
└── .gitignore            # Git ignore rules
🚢 Deployment
This app is deployed on Render with auto-deploy from GitHub. Any push to the main branch triggers a new deployment.

Live URL: https://meeting-to-jira-assistant.onrender.com

Setting Up Your Own Deployment
Fork this repository

Create a Render account

Add environment variables:

JIRA_DOMAIN

JIRA_EMAIL

JIRA_API_TOKEN

Connect your GitHub repository to Render

Deploy!

🔧 Future Enhancements
Add OpenAI GPT integration for smarter extraction

Support for multiple Jira projects

Export tickets to CSV

Custom ticket templates

Meeting recording upload

Slack integration

Email notifications

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is open source and available under the MIT License
