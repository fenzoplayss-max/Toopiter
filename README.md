# Toopiter - A Modern Social Media Platform

A production-ready, full-stack social media platform inspired by Twitter/X, built with Django, React, and modern technologies.

![Toopiter](https://img.shields.io/badge/Toopiter-Social_Media-7c3aed?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.14+-green.svg)
![Django](https://img.shields.io/badge/Django-5.0+-green.svg)
![React](https://img.shields.io/badge/React-18.2+-blue.svg)

## 🚀 Features

### Authentication & Security
- ✅ JWT-based authentication
- ✅ Email verification
- ✅ Password reset functionality
- ✅ Two-factor authentication (2FA)
- ✅ Session management

### User Profiles
- ✅ Customizable profiles (avatar, banner, bio)
- ✅ Follow/Unfollow system
- ✅ Block/Mute users
- ✅ Verification badges

### Posts & Content
- ✅ Create, edit, delete posts
- ✅ Rich media support (images, videos, GIFs)
- ✅ Multiple attachments (up to 4)
- ✅ Hashtags and mentions
- ✅ Reply threads
- ✅ Reposts and quote posts
- ✅ Bookmarks

### Feed System
- ✅ "For You" algorithmic feed
- ✅ "Following" chronological feed
- ✅ Infinite scroll

### Real-time Features
- ✅ WebSocket connections
- ✅ Real-time notifications
- ✅ Direct messaging

## 🛠️ Tech Stack

### Backend
- Python 3.14+, Django 5+, DRF, PostgreSQL, Redis, Celery

### Frontend  
- React 18+, TypeScript, Vite, TailwindCSS, Framer Motion

### Infrastructure
- Docker, Docker Compose, Nginx

## 📦 Quick Start

```bash
# Clone and start with Docker
git clone https://github.com/yourusername/toopiter.git
cd toopiter
docker-compose up -d

# Run migrations
docker-compose exec web python manage.py migrate

# Create superuser
docker-compose exec web python manage.py createsuperuser
```

Access the app at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin: http://localhost:8000/admin

## 📁 Project Structure

```
toopiter/
├── backend/           # Django backend
│   ├── accounts/     # Auth & profiles
│   ├── posts/        # Posts & replies
│   ├── interactions/ # Likes, reposts
│   └── messaging/    # Direct messages
├── frontend/         # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
└── docker-compose.yml
```

## 🧪 Testing

```bash
# Backend tests
docker-compose exec web pytest

# Frontend tests
cd frontend && npm test
```

## 📄 License

MIT License - see LICENSE file for details.

---

**Toopiter** - Your voice, amplified.
