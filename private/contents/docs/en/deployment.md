---
title: Deployment Guide
description: Deploy Rox to production environments
date: 2025-01-01
author: Rox Team
tags: [deployment, docker, production, cloudflare]
---

# Deployment Guide

This guide covers deploying Rox to various environments.

## Deployment Options

Rox can be deployed in multiple ways:

1. **Docker Compose** - Traditional VPS deployment
2. **Cloudflare Workers** - Edge deployment
3. **Bare Metal** - Direct installation

## Docker Compose Deployment

### Prerequisites

- Docker and Docker Compose installed
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)

### Step 1: Clone Repository

```bash
git clone https://github.com/Love-Rox/rox.git
cd rox
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your production settings:

```bash
# Database
DB_TYPE=postgres
DATABASE_URL=postgresql://rox:your_secure_password@postgres:5432/rox

# Storage
STORAGE_TYPE=s3
S3_ENDPOINT=https://your-account.r2.cloudflarestorage.com
S3_BUCKET_NAME=rox-media
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_REGION=auto

# Server
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com

# Security
JWT_SECRET=your-very-secure-random-string
SESSION_SECRET=another-secure-random-string

# Federation
INSTANCE_NAME=Your Instance Name
INSTANCE_DESCRIPTION=Your instance description
ADMIN_EMAIL=admin@your-domain.com
```

### Step 3: Build and Start

```bash
# Build images
docker compose build

# Start services
docker compose up -d

# Check status
docker compose ps
```

### Step 4: Run Migrations

```bash
docker compose exec backend bun run db:migrate
```

### Step 5: Create Admin User

```bash
docker compose exec backend bun run create-admin
```

### Step 6: Configure Reverse Proxy

#### Nginx Example

```nginx
# Backend API
server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Caddy Example

```caddyfile
api.your-domain.com {
    reverse_proxy localhost:3000
}

your-domain.com {
    reverse_proxy localhost:3001
}
```

## Cloudflare Workers Deployment

### Prerequisites

- Cloudflare account
- Wrangler CLI installed
- D1 database created
- R2 bucket created

### Step 1: Install Wrangler

```bash
npm install -g wrangler
wrangler login
```

### Step 2: Create D1 Database

```bash
wrangler d1 create rox-db
```

### Step 3: Create R2 Bucket

```bash
wrangler r2 bucket create rox-media
```

### Step 4: Configure wrangler.toml

```toml
name = "rox"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "rox-db"
database_id = "your-database-id"

[[r2_buckets]]
binding = "MEDIA"
bucket_name = "rox-media"

[vars]
NODE_ENV = "production"
INSTANCE_NAME = "Your Instance"
```

### Step 5: Run Migrations

```bash
wrangler d1 migrations apply rox-db
```

### Step 6: Deploy

```bash
wrangler deploy
```

## Bare Metal Deployment

### Prerequisites

- Ubuntu 22.04 or similar
- Bun installed
- PostgreSQL installed
- Nginx or Caddy installed

### Step 1: Install Dependencies

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx
```

### Step 2: Setup Database

```bash
sudo -u postgres psql
CREATE DATABASE rox;
CREATE USER rox WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE rox TO rox;
\q
```

### Step 3: Clone and Build

```bash
git clone https://github.com/Love-Rox/rox.git
cd rox
bun install
bun run build
```

### Step 4: Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### Step 5: Run Migrations

```bash
bun run db:migrate
```

### Step 6: Setup Systemd Service

Create `/etc/systemd/system/rox-backend.service`:

```ini
[Unit]
Description=Rox Backend
After=network.target postgresql.service

[Service]
Type=simple
User=rox
WorkingDirectory=/home/rox/rox/packages/backend
ExecStart=/home/rox/.bun/bin/bun run start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Create `/etc/systemd/system/rox-frontend.service`:

```ini
[Unit]
Description=Rox Frontend
After=network.target

[Service]
Type=simple
User=rox
WorkingDirectory=/home/rox/rox/packages/frontend
ExecStart=/home/rox/.bun/bin/bun run start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start services:

```bash
sudo systemctl enable rox-backend rox-frontend
sudo systemctl start rox-backend rox-frontend
```

## Database Backup

### PostgreSQL Backup

```bash
# Backup
pg_dump -U rox rox > backup.sql

# Restore
psql -U rox rox < backup.sql
```

### Automated Backups

Create a backup script:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/rox"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
pg_dump -U rox rox | gzip > $BACKUP_DIR/rox_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "rox_*.sql.gz" -mtime +7 -delete
```

Add to crontab:

```bash
0 2 * * * /path/to/backup.sh
```

## Monitoring

### Health Checks

Rox provides health check endpoints:

```bash
# Backend health
curl https://api.your-domain.com/health

# Database health
curl https://api.your-domain.com/health/db
```

### Metrics

Metrics are available at:

```bash
curl https://api.your-domain.com/metrics
```

### Logging

Logs are written to stdout and can be collected using:

- Docker: `docker compose logs -f`
- Systemd: `journalctl -u rox-backend -f`

## Security Checklist

- [ ] Use strong passwords for database
- [ ] Configure firewall (UFW recommended)
- [ ] Enable SSL/TLS certificates
- [ ] Set secure JWT_SECRET and SESSION_SECRET
- [ ] Configure rate limiting
- [ ] Enable CORS only for trusted domains
- [ ] Keep system and dependencies updated
- [ ] Regular security audits
- [ ] Backup database regularly
- [ ] Monitor logs for suspicious activity

## Performance Optimization

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_users_username ON users(username);
```

### Caching

Configure Redis/Dragonfly for caching:

```bash
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
```

### CDN Configuration

Use Cloudflare or similar CDN for:
- Static assets
- Media files
- API responses (with appropriate cache headers)

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U rox -h localhost -d rox
```

### Port Conflicts

```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill process if needed
sudo kill -9 <PID>
```

### Permission Issues

```bash
# Fix ownership
sudo chown -R rox:rox /home/rox/rox

# Fix permissions
chmod -R 755 /home/rox/rox
```

## Scaling

### Horizontal Scaling

Run multiple backend instances behind a load balancer:

```nginx
upstream rox_backend {
    server backend1:3000;
    server backend2:3000;
    server backend3:3000;
}

server {
    location / {
        proxy_pass http://rox_backend;
    }
}
```

### Database Scaling

- Use PostgreSQL replication for read replicas
- Consider PgBouncer for connection pooling
- Partition large tables

## Next Steps

- [Configuration Guide](configuration) - Detailed configuration options
- [Monitoring Guide](monitoring) - Set up monitoring and alerts
- [Backup Strategy](backup) - Comprehensive backup strategy
