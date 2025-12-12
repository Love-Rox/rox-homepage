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

## Using DevContainer (Recommended)

If you're using VS Code or GitHub Codespaces, you can set up your development environment with just one click using DevContainer.

### DevContainer Features

- **One-click setup**: Dependencies, databases, and SSL certificates are all automatically configured
- **Multi-database**: PostgreSQL, MariaDB, and Dragonfly are ready to use out of the box
- **HTTPS enabled**: Local SSL certificates are automatically generated with mkcert
- **AI development support**: Claude Code comes pre-installed

### Setup Steps

1. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) in VS Code
2. Clone the repository: `git clone https://github.com/Love-rox/rox.git`
3. Open the folder in VS Code
4. Select "Reopen in Container" (or press `F1` → `Dev Containers: Reopen in Container`)
5. The initial setup will run automatically (takes about 5-10 minutes)

Once setup is complete, start development with:

```bash
bun run dev
```

> **Tip**: HTTPS is enabled inside DevContainer, so you can access it via `https://localhost`.

---

## Manual Installation

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

- `URL`: Your instance's public URL (e.g., `https://your-domain.com`)
- `DATABASE_URL`: Your database connection string
- `STORAGE_TYPE`: Choose between `local` or `s3`

### 4. Start Development Services

Start PostgreSQL and Dragonfly using Docker Compose (for development only):

```bash
docker compose up -d
```

Wait for services to be healthy:

```bash
docker compose ps
```

> **Note**: Docker is used here for development database services. For production deployments, we recommend [bare metal installation](deployment) for better performance and control.

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

---

## Update History

| Date | Changes |
|------|---------|
| 2025-12-12 | Added DevContainer section |
