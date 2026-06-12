# Toopiter - Twitter/X Clone Social Media Platform

A production-ready social media platform inspired by Twitter/X, built with Django 5+ and React 18.

![Toopiter](https://img.shields.io/badge/Toopiter-Social%20Media-purple?style=for-the-badge)
![Django](https://img.shields.io/badge/Django-5.0+-green?style=for-the-badge&logo=django)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?style=for-the-badge&logo=postgresql)

## Features

### Core Features
- ✅ User Authentication (JWT, Email Verification, Password Reset, 2FA)
- ✅ User Profiles (Customization, Follow/Unfollow, Block/Mute)
- ✅ Posts (Create, Edit, Delete, Schedule, Drafts, Pin)
- ✅ Rich Media Support (Images, GIFs, Videos, Multiple Attachments)
- ✅ Feed System (Following, For You, Trending, Infinite Scroll)
- ✅ Engagement (Likes, Reposts, Replies, Bookmarks, Shares)
- ✅ Real-time Messaging (Direct Messages, Typing Indicators, Read Receipts)
- ✅ Notifications (Real-time, Push Notification Ready)
- ✅ Search (Users, Posts, Hashtags, Advanced Search)
- ✅ Trending System (Hashtags, Topics, Analytics)
- ✅ Moderation (Reports, Auto-moderation, Toxicity Detection)
- ✅ Premium Features (Verification, Analytics, Post Scheduling)

### Technical Features
- RESTful API with Django REST Framework
- Real-time features with Django Channels & WebSockets
- Background tasks with Celery
- Redis caching
- PostgreSQL database with optimizations
- Responsive UI with TailwindCSS
- Dark/Light mode
- Security hardened (OWASP best practices)

## Project Structure

```
toopiter/
├── backend/                 # Django backend
│   ├── toopiter/           # Django settings
│   ├── accounts/           # User authentication & profiles
│   ├── posts/              # Post management
│   ├── engagement/         # Likes, reposts, bookmarks
│   ├── feeds/              # Feed generation
│   ├── messaging/          # Direct messages
│   ├── notifications/      # Notifications system
│   ├── search/             # Search functionality
│   ├── trending/           # Trending topics
│   ├── moderation/         # Content moderation
│   ├── analytics/          # Analytics engine
│   ├── premium/            # Premium features
│   ├── media/              # Media handling
│   ├── api/                # API root
│   ├── core/               # Core utilities
│   ├── manage.py           # Django management
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── stores/         # State management
│   │   ├── services/       # API services
│   │   └── utils/          # Utilities
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

## Quick Start (Windows)

### Prerequisites

1. **Python 3.11+** - Download from [python.org](https://www.python.org/downloads/)
2. **PostgreSQL 15+** - Download from [postgresql.org](https://www.postgresql.org/download/windows/)
3. **Redis** - Download from [GitHub](https://github.com/microsoftarchive/redis/releases) or use WSL
4. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)

### Backend Setup

#### 1. Install PostgreSQL

```powershell
# Download and install PostgreSQL from https://www.postgresql.org/download/windows/
# During installation, remember your password for the 'postgres' user
```

#### 2. Create Database

```powershell
# Open PowerShell as Administrator and run:
cd "C:\Program Files\PostgreSQL\15\bin"
.\psql.exe -U postgres

# In psql, run:
CREATE DATABASE toopiter;
CREATE USER toopiter WITH PASSWORD 'toopiter_password';
GRANT ALL PRIVILEGES ON DATABASE toopiter TO toopiter;
\q
```

#### 3. Install Redis (Option A: Use WSL)

```powershell
# Enable WSL if not already enabled
wsl --install

# In WSL Ubuntu:
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

#### 4. Install Redis (Option B: Manual Windows Install)

```powershell
# Download Redis for Windows from:
# https://github.com/microsoftarchive/redis/releases/download/win-3.0.504/Redis-x64-3.0.504.zip

# Extract and run:
cd C:\path\to\Redis
redis-server.exe
```

#### 5. Setup Python Environment

```powershell
# Navigate to backend folder
cd path\to\toopiter\backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

#### 6. Configure Environment

```powershell
# Copy example env file
copy .env.example .env

# Edit .env file with your settings:
# - Set POSTGRES_PASSWORD to your PostgreSQL password
# - Adjust other settings as needed
notepad .env
```

#### 7. Run Migrations

```powershell
# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

#### 8. Start Backend Server

```powershell
# Development server
python manage.py runserver

# The API will be available at http://localhost:8000
# API docs at http://localhost:8000/api/docs/
```

### Frontend Setup

```powershell
# Navigate to frontend folder
cd path\to\toopiter\frontend

# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

## Running Both Services

Open two PowerShell windows:

**Window 1 - Backend:**
```powershell
cd path\to\toopiter\backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

**Window 2 - Frontend:**
```powershell
cd path\to\toopiter\frontend
npm run dev
```

## Optional: Start Celery Worker

For background tasks (email sending, media processing, etc.):

```powershell
cd path\to\toopiter\backend
.\venv\Scripts\Activate.ps1

# Start Celery worker
celery -A toopiter worker --loglevel=info

# Start Celery beat (for scheduled tasks)
celery -A toopiter beat --loglevel=info
```

## API Documentation

Once the backend is running, access:
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/schema/

## Default Credentials

After creating a superuser:
- Email: (your email)
- Password: (your password)

## Troubleshooting

### PostgreSQL Connection Error

```powershell
# Check if PostgreSQL is running
Get-Service -Name postgresql*

# Start if not running
Start-Service postgresql-x64-15

# Check pg_hba.conf allows local connections
# Located at: C:\Program Files\PostgreSQL\15\data\pg_hba.conf
```

### Redis Connection Error

```powershell
# Check if Redis is running (WSL)
wsl sudo service redis-server status

# Start Redis (WSL)
wsl sudo service redis-server start

# Or check Windows Redis service
Get-Service | Where-Object {$_.Name -like "*redis*"}
```

### Port Already in Use

```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## Production Deployment

For production deployment, see `DEPLOYMENT.md` (to be created).

Key considerations:
- Set DEBUG=False
- Use secure SECRET_KEY
- Configure HTTPS
- Set up proper database backups
- Configure monitoring (Sentry, etc.)
- Use a production WSGI server (Gunicorn/uWSGI)
- Set up Nginx reverse proxy

## Testing

```powershell
# Backend tests
cd backend
.\venv\Scripts\Activate.ps1
pytest

# Frontend tests
cd frontend
npm test
```

## Technology Stack

### Backend
- **Framework**: Django 5.0+
- **API**: Django REST Framework
- **Database**: PostgreSQL
- **Cache**: Redis
- **Task Queue**: Celery
- **Real-time**: Django Channels
- **Authentication**: JWT (djangorestframework-simplejwt)

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State**: Zustand
- **HTTP Client**: Axios
- **Animations**: Framer Motion

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Documentation: See `/docs` folder

---

Built with ❤️ by the Toopiter Team
