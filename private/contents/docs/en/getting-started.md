---
title: Getting Started with Rox
description: Learn how to set up and run Rox locally
date: 2025-01-01
author: Rox Team
tags: [setup, installation, tutorial]
---

# Getting Started with Rox

Welcome to Rox! This guide will help you set up and run Rox on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Bun](https://bun.sh/) >= 1.0.0
- [Docker](https://www.docker.com/) and Docker Compose
- PostgreSQL >= 14 (or MySQL >= 8.0, or SQLite)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Love-rox/rox.git
cd rox
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Setup Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration. Key variables include:

- `DATABASE_URL`: Your database connection string
- `STORAGE_TYPE`: Choose between `local` or `s3`
- `JWT_SECRET`: Secret key for JWT tokens

### 4. Start Development Services

Start PostgreSQL and Dragonfly using Docker Compose:

```bash
docker compose up -d
```

Wait for services to be healthy:

```bash
docker compose ps
```

### 5. Run Database Migrations

Generate and run database migrations:

```bash
bun run db:generate
bun run db:migrate
```

### 6. Start Development Servers

Start both backend and frontend:

```bash
bun run dev
```

Or start them individually:

```bash
# Backend only
bun run backend:dev

# Frontend only
bun run frontend:dev
```

The services will be available at:
- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:3001

## Next Steps

- Read the [Architecture Guide](architecture) to understand how Rox works
- Check out the [Deployment Guide](deployment) for production setup
- Join our community on [GitHub](https://github.com/Love-rox/rox)

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors, make sure:
- Docker services are running (`docker compose ps`)
- Database credentials in `.env` match your setup
- PostgreSQL port (5432) is not already in use

### Port Conflicts

If ports 3000 or 3001 are already in use, you can change them in:
- Backend: `packages/backend/.env` → `PORT`
- Frontend: `packages/frontend/waku.config.ts` → `port`
