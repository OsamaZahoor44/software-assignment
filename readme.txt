# 🎧 Media Search App

A full-stack application that allows users to search for openly licensed media (images, audio, video) using the [Openverse API](https://api.openverse.engineering/v1/). Users can log in, view search history, and filter results by media type or file extension.

## 🛠️ Tech Stack

- **Frontend**: React / Next.js (`client/`)
- **Backend**: Node.js / Express (`server/`)
- **Database**: None (stateless app; optional extension)
- **Auth**: JWT-based login/signup
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions → Heroku (Docker container deploy)
- **API**: [Openverse API](https://openverse.org/)

---

## 🚀 Features

- 🔍 Search openly licensed media
- ✅ Filter by type (image, audio, video) and extension
- 🧠 Save and view search history
- 🔐 User authentication with JWT
- 📦 Containerized deployment using Docker
- 🔁 Automated CI/CD with GitHub Actions & Heroku

---

## 🧪 Local Setup

```bash
# Clone the repo
git clone https://github.com/your-username/media-search-app.git
cd media-search-app

# Run with Docker Compose
docker-compose up --build
