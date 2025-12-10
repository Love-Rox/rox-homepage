---
title: Configuration Guide
description: Configure Rox for your deployment
date: 2025-12-10
author: Rox Team
tags: [configuration, environment-variables, setup]
---

# Configuration Guide

This guide covers all configuration options for Rox.

## Environment Variables

Rox is configured entirely through environment variables. Copy `.env.example` to `.env` and customize as needed.

### Application Configuration

```bash
# Backend server port (default: 3000)
PORT=3000

# Frontend server port (default: 3001)
FRONTEND_PORT=3001

# Environment mode: development | production
NODE_ENV=development

# Public URL of your instance (used for ActivityPub, links, etc.)
# IMPORTANT: This must match your actual public URL for federation to work
URL=https://your-domain.com
```

**Options:**
- `PORT`: Backend server port (default: `3000`)
- `FRONTEND_PORT`: Frontend server port (default: `3001`)
- `NODE_ENV`: Environment (`development` or `production`)
- `URL`: Public URL of your instance (required for federation)

### Database Configuration

#### PostgreSQL (Recommended)

```bash
DB_TYPE=postgres
DATABASE_URL=postgresql://username:password@host:5432/database
```

**Options:**
- `username`: Database user
- `password`: Database password
- `host`: Database host (default: `localhost`)
- `5432`: PostgreSQL port
- `database`: Database name

#### MySQL

```bash
DB_TYPE=mysql
DATABASE_URL=mysql://username:password@host:3306/database
```

#### SQLite

```bash
DB_TYPE=sqlite
DATABASE_URL=sqlite://./rox.db
```

#### Database Connection Pool Settings (PostgreSQL only)

```bash
# Maximum number of connections in the pool (default: 10)
DB_POOL_MAX=10

# Close idle connections after this many seconds (default: 20)
DB_IDLE_TIMEOUT=20

# Maximum connection lifetime in seconds (default: 1800 = 30 minutes)
DB_MAX_LIFETIME=1800

# Connection timeout in seconds (default: 30)
DB_CONNECT_TIMEOUT=30
```

### Storage Configuration

#### Local Storage

```bash
STORAGE_TYPE=local
LOCAL_STORAGE_PATH=./uploads
```

**Options:**
- `LOCAL_STORAGE_PATH`: Directory for uploaded files (default: `./uploads`)

#### S3-Compatible Storage

```bash
STORAGE_TYPE=s3
S3_ENDPOINT=https://your-account.r2.cloudflarestorage.com
S3_BUCKET_NAME=rox-media
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_REGION=auto
S3_PUBLIC_URL=https://media.your-domain.com
```

> [!IMPORTANT]
> The `S3_ENDPOINT` should NOT include the bucket name! The bucket name is specified separately via `S3_BUCKET_NAME`.
>
> **Correct:** `https://your-account.r2.cloudflarestorage.com`
> **Incorrect:** `https://rox-media.your-account.r2.cloudflarestorage.com`

**Options:**
- `S3_ENDPOINT`: S3 endpoint URL
- `S3_BUCKET_NAME`: Bucket name
- `S3_ACCESS_KEY`: Access key ID
- `S3_SECRET_KEY`: Secret access key
- `S3_REGION`: Region (use `auto` for Cloudflare R2)
- `S3_PUBLIC_URL`: Public URL for media (optional)

**Supported Providers:**
- AWS S3
- Cloudflare R2
- MinIO
- DigitalOcean Spaces
- Backblaze B2

### File Upload Configuration

```bash
# Maximum file size in bytes (default: 10MB = 10485760)
MAX_FILE_SIZE=10485760

# Maximum number of files per note (default: 4)
MAX_FILES_PER_NOTE=4

# Allowed MIME types for uploads
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm

# Enable automatic WebP conversion for images (default: false)
ENABLE_WEBP_CONVERSION=false
```

### Authentication & Sessions

```bash
# Session expiry in days (default: 30)
SESSION_EXPIRY_DAYS=30

# JWT secret for token signing (reserved for future use)
JWT_SECRET=your-secure-random-secret-here
```

**Generate Secure Secrets:**

```bash
# Using openssl
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using Bun
bun -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Registration & Moderation

```bash
# Enable new user registration (default: false)
ENABLE_REGISTRATION=true

# Require invitation code for registration (default: false)
REQUIRE_INVITATION=false
```

### OAuth Configuration (Optional)

Configure OAuth providers to allow users to login/register using external accounts.

#### GitHub OAuth

Create OAuth app at: https://github.com/settings/developers

```bash
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=https://your-domain.com/api/auth/oauth/github/callback
```

#### Google OAuth

Create credentials at: https://console.cloud.google.com/apis/credentials

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/oauth/google/callback
```

#### Discord OAuth

Create application at: https://discord.com/developers/applications

```bash
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_REDIRECT_URI=https://your-domain.com/api/auth/oauth/discord/callback
```

#### Mastodon OAuth

Register app in your Mastodon instance: Settings > Development > New Application
Scopes needed: `read:accounts`

```bash
MASTODON_CLIENT_ID=your-mastodon-client-id
MASTODON_CLIENT_SECRET=your-mastodon-client-secret
MASTODON_INSTANCE_URL=https://mastodon.social
MASTODON_REDIRECT_URI=https://your-domain.com/api/auth/oauth/mastodon/callback
```

### Instance Configuration

```bash
INSTANCE_NAME=Your Instance Name
INSTANCE_DESCRIPTION=A lightweight ActivityPub server
ADMIN_EMAIL=admin@your-domain.com
```

**Options:**
- `INSTANCE_NAME`: Name of your instance (shown in NodeInfo)
- `INSTANCE_DESCRIPTION`: Description shown on instance info
- `ADMIN_EMAIL`: Admin contact email (shown in NodeInfo)

### Federation & ActivityPub

```bash
# Enable federation (ActivityPub support)
ENABLE_FEDERATION=true
```

### Redis / Queue Configuration

```bash
# Redis URL for caching and job queues
REDIS_URL=redis://localhost:6379

# Disable queue and use synchronous delivery (default: false)
USE_QUEUE=true

# Number of retry attempts for failed ActivityPub deliveries
DELIVERY_RETRY_ATTEMPTS=3

# Stats logging interval in milliseconds (default: 3600000 = 1 hour)
STATS_LOG_INTERVAL_MS=3600000
```

> [!NOTE]
> Redis is required for the ActivityPub delivery queue in production. You can use [Dragonfly](https://www.dragonflydb.io/) as a high-performance Redis alternative.

### Web Push Notifications (VAPID)

Generate VAPID keys with:

```bash
bunx web-push generate-vapid-keys
```

```bash
# VAPID public key (share this with the frontend)
VAPID_PUBLIC_KEY=your-vapid-public-key

# VAPID private key (keep this secret!)
VAPID_PRIVATE_KEY=your-vapid-private-key

# Contact email for VAPID (falls back to ADMIN_EMAIL if not set)
VAPID_CONTACT_EMAIL=mailto:admin@example.com
```

### Logging Configuration

```bash
LOG_LEVEL=info
```

**Options:**
- `LOG_LEVEL`: Logging level (`debug`, `info`, `warn`, `error`)
  - Default: `debug` in development, `info` in production

## Configuration Files

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: rox
      POSTGRES_USER: rox
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  dragonfly:
    image: docker.dragonflydb.io/dragonflydb/dragonfly
    ports:
      - "6379:6379"
    volumes:
      - dragonfly_data:/data

  backend:
    build: ./packages/backend
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://dragonfly:6379
      - URL=${URL}
    depends_on:
      - postgres
      - dragonfly
    ports:
      - "3000:3000"

  frontend:
    build: ./packages/frontend
    environment:
      - BACKEND_URL=http://backend:3000
    depends_on:
      - backend
    ports:
      - "3001:3001"

volumes:
  postgres_data:
  dragonfly_data:
```

## Configuration Best Practices

### Security

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong secrets** - Minimum 32 characters, random
3. **Rotate secrets regularly** - Change JWT/session secrets periodically
4. **Enable HTTPS** - Always use SSL/TLS in production

### Performance

1. **Enable caching** - Configure Redis for better performance
2. **Use CDN** - Serve static assets through CDN
3. **Optimize database** - Add indexes for common queries
4. **Configure connection pooling** - Tune `DB_POOL_MAX` for your workload

### Reliability

1. **Set up monitoring** - Monitor health endpoints
2. **Configure backups** - Regular database backups
3. **Use health checks** - Configure Docker health checks
4. **Set resource limits** - Limit memory and CPU usage

## Environment-Specific Configurations

### Development

```bash
NODE_ENV=development
LOG_LEVEL=debug
URL=http://localhost:3000
ENABLE_REGISTRATION=true
```

### Production

```bash
NODE_ENV=production
LOG_LEVEL=info
URL=https://your-domain.com
ENABLE_FEDERATION=true
```

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql -h localhost -U rox -d rox

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Storage Issues

```bash
# Test S3 connection
aws s3 ls s3://your-bucket --endpoint-url=$S3_ENDPOINT

# Check local storage permissions
ls -la ./uploads
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli -u $REDIS_URL ping
```

## Next Steps

- [Deployment Guide](deployment) - Deploy Rox to production
- [Architecture Guide](architecture) - Understand the architecture
- [API Reference](api-overview) - Explore the API

---

## Update History

| Date | Changes |
|------|---------|
| 2025-12-10 | Updated to match current .env.example: Added OAuth providers, VAPID, file upload config, simplified URL configuration |
