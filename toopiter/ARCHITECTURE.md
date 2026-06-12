# Toopiter - System Architecture

## Overview

Toopiter is a production-ready social media platform inspired by Twitter/X, built with modern technologies for scalability, performance, and security.

## Tech Stack

### Backend
- **Python 3.14+** - Core language
- **Django 5+** - Web framework
- **Django REST Framework** - API framework
- **PostgreSQL** - Primary database
- **Redis** - Caching & message broker
- **Celery** - Async task processing
- **Django Channels** - WebSocket support
- **JWT** - Authentication

### Frontend
- **React 18+** - UI framework (chosen over HTMX for complex real-time features)
- **TailwindCSS** - Styling
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Query** - Data fetching
- **Zustand** - State management
- **Socket.io Client** - Real-time communication

**Why React over HTMX?**
- Complex real-time features (messaging, notifications, typing indicators)
- Rich interactive UI components
- Better state management for feeds and infinite scroll
- Superior mobile experience with PWA capabilities
- Component reusability across the platform

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy
- **CI/CD Ready** - GitHub Actions compatible

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Web App   │  │  Mobile App │  │  Admin Panel│              │
│  │   (React)   │  │   (Future)  │  │   (React)   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CDN / Static Files                        │
│                    (Images, Videos, Assets)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Load Balancer (Nginx)                       │
│                   SSL Termination, Rate Limiting                 │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   API Server 1   │ │   API Server 2   │ │   API Server N   │
│   (Gunicorn)     │ │   (Gunicorn)     │ │   (Gunicorn)     │
└──────────────────┘ └──────────────────┘ └──────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   PostgreSQL     │ │     Redis        │ │    Celery        │
│   (Primary DB)   │ │   (Cache/Broker) │ │    Workers       │
└──────────────────┘ └──────────────────┘ └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Django Channels Layer                        │
│                  (WebSocket Connections)                         │
└─────────────────────────────────────────────────────────────────┘
```

## Folder Structure

```
toopiter/
├── backend/
│   ├── toopiter/           # Django project settings
│   ├── accounts/           # User authentication & profiles
│   ├── posts/              # Posts, replies, reposts
│   ├── media/              # Media uploads & processing
│   ├── feeds/              # Feed generation & ranking
│   ├── engagement/         # Likes, bookmarks, shares
│   ├── messaging/          # Direct messages
│   ├── notifications/      # Notification system
│   ├── search/             # Search functionality
│   ├── trending/           # Trending topics & hashtags
│   ├── moderation/         # Content moderation
│   ├── analytics/          # Analytics & insights
│   ├── premium/            # Premium features
│   ├── api/                # API versioning & documentation
│   ├── core/               # Core utilities & mixins
│   ├── tests/              # Test suite
│   ├── requirements/       # Python dependencies
│   ├── manage.py
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── stores/         # Zustand state stores
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript types
│   │   ├── styles/         # Global styles
│   │   └── assets/         # Static assets
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── infrastructure/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── nginx/
│   │   └── nginx.conf
│   ├── scripts/
│   │   ├── init-db.sh
│   │   └── entrypoint.sh
│   └── kubernetes/         # K8s manifests (future)
├── docs/
│   ├── API.md
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPER.md
└── README.md
```

## Database Design

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│      User       │       │    UserProfile  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┬──▶│ id (PK)         │
│ username        │   │   │ user (FK)       │
│ email           │   │   │ bio             │
│ password_hash   │   │   │ website         │
│ is_verified     │   │   │ location        │
│ is_premium      │   │   │ birth_date      │
│ created_at      │   │   │ avatar          │
│ updated_at      │   │   │ banner          │
└─────────────────┘   │   │ verified_badge  │
                      │   └─────────────────┘
                      │
                      │   ┌─────────────────┐
                      │   │   Follow        │
                      │   ├─────────────────┤
                      │   │ id (PK)         │
                      │   │ follower (FK)   │◀──┐
                      │   │ following (FK)  │───┘
                      │   │ created_at      │
                      │   └─────────────────┘
                      │
                      │   ┌─────────────────┐
                      │   │      Post       │
                      │   ├─────────────────┤
                      │   │ id (PK)         │
                      │   │ author (FK)     │◀──┘
                      │   │ content         │
                      │   │ parent (FK)     │───┐
                      │   │ is_repost       │   │
                      │   │ quote_post (FK) │   │
                      │   │ is_edited       │   │
                      │   │ is_pinned       │   │
                      │   │ is_scheduled    │   │
                      │   │ scheduled_at    │   │
                      │   │ created_at      │   │
                      │   │ updated_at      │   │
                      │   └─────────────────┘
                      │           │
                      │           │ self-referential (replies)
                      │           ▼
                      │   ┌─────────────────┐
                      │   │   PostMedia     │
                      │   ├─────────────────┤
                      │   │ id (PK)         │
                      │   │ post (FK)       │◀──┐
                      │   │ media (FK)      │   │
                      │   │ order           │   │
                      │   └─────────────────┘
                      │
                      │   ┌─────────────────┐
                      │   │     Media       │
                      │   ├─────────────────┤
                      │   │ id (PK)         │
                      │   │ user (FK)       │◀──┘
                      │   │ file            │
                      │   │ media_type      │
                      │   │ thumbnail       │
                      │   │ size            │
                      │   │ created_at      │
                      │   └─────────────────┘
                      │
                      │   ┌─────────────────┐
                      │   │     Like        │
                      │   ├─────────────────┤
                      │   │ id (PK)         │
                      │   │ user (FK)       │◀──┐
                      │   │ post (FK)       │───┘
                      │   │ created_at      │
                      │   └─────────────────┘
                      │
                      │   ┌─────────────────┐
                      │   │   Bookmark      │
                      │   ├─────────────────┤
                      │   │ id (PK)         │
                      │   │ user (FK)       │◀──┐
                      │   │ post (FK)       │───┘
                      │   │ created_at      │
                      │   └─────────────────┘
                      │
                      │   ┌─────────────────┐
                      │   │  Notification   │
                      │   ├─────────────────┤
                      │   │ id (PK)         │
                      │   │ recipient (FK)  │◀──┐
                      │   │ actor (FK)      │   │
                      │   │ post (FK)       │   │
                      │   │ type            │   │
                      │   │ is_read         │   │
                      │   │ created_at      │   │
                      │   └─────────────────┘
                      │
                      │   ┌─────────────────┐
                      │   │    Message      │
                      │   ├─────────────────┤
                      │   │ id (PK)         │
                      │   │ conversation (FK│◀──┐
                      │   │ sender (FK)     │   │
                      │   │ content         │   │
                      │   │ is_read         │   │
                      │   │ created_at      │   │
                      │   └─────────────────┘
                      │
                      │   ┌─────────────────┐
                      │   │ Conversation    │
                      │   ├─────────────────┤
                      │   │ id (PK)         │
                      │   │ participants    │───┘
                      │   │ created_at      │
                      │   └─────────────────┘
                      │
                      │   ┌─────────────────┐
                      │   │     Report      │
                      │   ├─────────────────┤
                      │   │ id (PK)         │
                      │   │ reporter (FK)   │◀──┐
                      │   │ reported_user   │   │
                      │   │ reported_post   │   │
                      │   │ reason          │   │
                      │   │ status          │   │
                      │   │ created_at      │   │
                      │   └─────────────────┘
                      │
                      │   ┌─────────────────┐
                      │   │    Hashtag      │
                      │   ├─────────────────┤
                      │   │ id (PK)         │
                      │   │ tag             │
                      │   │ usage_count     │
                      │   │ trending_score  │
                      │   └─────────────────┘
                      │
                      └──▶│ PostHashtag     │
                          ├─────────────────┤
                          │ id (PK)         │
                          │ post (FK)       │
                          │ hashtag (FK)    │
                          └─────────────────┘
```

### Core Models Summary

1. **User** - Extended AbstractUser with verification and premium flags
2. **UserProfile** - One-to-one with User, contains profile details
3. **Follow** - Many-to-many through model for user relationships
4. **Post** - Main content model with self-referential replies
5. **Media** - Stores uploaded media files
6. **PostMedia** - Many-to-many between Post and Media
7. **Like** - User-Post interaction
8. **Bookmark** - User saves posts
9. **Notification** - Real-time notifications
10. **Conversation/Message** - Direct messaging
11. **Report** - Content moderation
12. **Hashtag/PostHashtag** - Hashtag tracking
13. **Block/Mute** - User blocking/muting

## Migration Strategy

1. **Initial Migration** - Core models (User, UserProfile, Post)
2. **Secondary Migration** - Engagement models (Like, Bookmark, Follow)
3. **Tertiary Migration** - Messaging & Notifications
4. **Final Migration** - Moderation & Analytics

## Caching Strategy

- **Redis Cache Layers:**
  - User profile cache (5 min TTL)
  - Feed cache (1 min TTL)
  - Trending topics cache (5 min TTL)
  - Session cache (JWT blacklist)
  - Rate limiting counters

## Scalability Considerations

1. **Database:**
   - Read replicas for feed queries
   - Partitioning for large tables (posts, notifications)
   - Connection pooling with PgBouncer

2. **Application:**
   - Horizontal scaling with multiple Gunicorn workers
   - Stateless design for easy replication
   - Celery for async tasks

3. **Media:**
   - CDN integration for static assets
   - S3-compatible storage for media files
   - Background processing for video transcoding

## Security Measures

- JWT with short-lived access tokens + refresh tokens
- CSRF protection on all forms
- XSS prevention via Content Security Policy
- SQL injection prevention via ORM
- Rate limiting on API endpoints
- Secure file upload validation
- Audit logging for admin actions
- OWASP Top 10 compliance
