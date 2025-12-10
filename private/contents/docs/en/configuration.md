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

### Server Configuration

```bash
NODE_ENV=production
PORT=3000
FRONTEND_PORT=3001
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com
```

**Options:**
- `NODE_ENV`: Environment (`development` or `production`)
- `PORT`: Backend server port (default: `3000`)
- `FRONTEND_PORT`: Frontend server port (default: `3001`)
- `FRONTEND_URL`: Frontend public URL
- `BACKEND_URL`: Backend public URL

### Security Configuration

```bash
JWT_SECRET=your-very-secure-random-string-at-least-32-chars
SESSION_SECRET=another-secure-random-string-at-least-32-chars
COOKIE_SECURE=true
COOKIE_DOMAIN=.your-domain.com
```

**Options:**
- `JWT_SECRET`: Secret for JWT tokens (required, min 32 chars)
- `SESSION_SECRET`: Secret for sessions (required, min 32 chars)
- `COOKIE_SECURE`: Use secure cookies (default: `true` in production)
- `COOKIE_DOMAIN`: Cookie domain (optional)

**Generate Secure Secrets:**

```bash
# Using openssl
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using Bun
bun -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Instance Configuration

```bash
INSTANCE_NAME=Your Instance Name
INSTANCE_DESCRIPTION=A description of your instance
ADMIN_EMAIL=admin@your-domain.com
INSTANCE_ICON_URL=https://your-domain.com/icon.png
INSTANCE_BANNER_URL=https://your-domain.com/banner.png
```

**Options:**
- `INSTANCE_NAME`: Name of your instance
- `INSTANCE_DESCRIPTION`: Description shown on instance info
- `ADMIN_EMAIL`: Admin contact email
- `INSTANCE_ICON_URL`: Instance icon/logo URL
- `INSTANCE_BANNER_URL`: Instance banner image URL

### Federation Configuration

```bash
FEDERATION_ENABLED=true
FEDERATION_ALLOWLIST=
FEDERATION_BLOCKLIST=
SHARED_INBOX_ENABLED=true
```

**Options:**
- `FEDERATION_ENABLED`: Enable ActivityPub federation (default: `true`)
- `FEDERATION_ALLOWLIST`: Comma-separated list of allowed domains (empty = allow all)
- `FEDERATION_BLOCKLIST`: Comma-separated list of blocked domains
- `SHARED_INBOX_ENABLED`: Enable shared inbox (default: `true`)

**Example:**

```bash
# Block specific instances
FEDERATION_BLOCKLIST=spam.example.com,bad-actor.net

# Allow only specific instances
FEDERATION_ALLOWLIST=mastodon.social,misskey.io
```

### Cache Configuration

```bash
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
```

**Options:**
- `REDIS_URL`: Redis connection URL (optional, uses Dragonfly in Docker)
- `CACHE_TTL`: Default cache TTL in seconds (default: `3600`)

### Queue Configuration

```bash
QUEUE_REDIS_URL=redis://localhost:6379
QUEUE_CONCURRENCY=10
QUEUE_MAX_RETRIES=3
```

**Options:**
- `QUEUE_REDIS_URL`: Redis URL for BullMQ (defaults to `REDIS_URL`)
- `QUEUE_CONCURRENCY`: Number of concurrent jobs (default: `10`)
- `QUEUE_MAX_RETRIES`: Max retry attempts for failed jobs (default: `3`)

### Rate Limiting

```bash
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Options:**
- `RATE_LIMIT_ENABLED`: Enable rate limiting (default: `true`)
- `RATE_LIMIT_WINDOW_MS`: Time window in milliseconds (default: `900000` = 15 min)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default: `100`)

### Email Configuration

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@your-domain.com
```

**Options:**
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port (587 for TLS, 465 for SSL)
- `SMTP_SECURE`: Use SSL (default: `false`, use TLS)
- `SMTP_USER`: SMTP username
- `SMTP_PASSWORD`: SMTP password
- `SMTP_FROM`: From email address

### Logging Configuration

```bash
LOG_LEVEL=info
LOG_FORMAT=json
```

**Options:**
- `LOG_LEVEL`: Logging level (`debug`, `info`, `warn`, `error`)
- `LOG_FORMAT`: Log format (`json` or `pretty`)

### Development Configuration

```bash
# Development only
DEV_CORS_ORIGIN=http://localhost:3001
DEV_SKIP_AUTH=false
```

**Options:**
- `DEV_CORS_ORIGIN`: CORS origin for development
- `DEV_SKIP_AUTH`: Skip authentication (DANGEROUS, dev only)

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
4. **Limit CORS origins** - Only allow trusted domains
5. **Enable HTTPS** - Always use SSL/TLS in production

### Performance

1. **Enable caching** - Configure Redis for better performance
2. **Use CDN** - Serve static assets through CDN
3. **Optimize database** - Add indexes for common queries
4. **Configure connection pooling** - Use PgBouncer for PostgreSQL

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
LOG_FORMAT=pretty
DEV_CORS_ORIGIN=http://localhost:3001
RATE_LIMIT_ENABLED=false
```

### Staging

```bash
NODE_ENV=production
LOG_LEVEL=info
LOG_FORMAT=json
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=200
```

### Production

```bash
NODE_ENV=production
LOG_LEVEL=warn
LOG_FORMAT=json
COOKIE_SECURE=true
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
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
| 2025-12-10 | Removed Cloudflare D1 and wrangler.toml sections (development discontinued) |
