---
title: Rox December 2025 Update
description: Important updates about Rox deployment options and development progress
date: 2025-12-10
author: Rox Team
tags: [update, deployment, announcement]
excerpt: Important updates regarding Cloudflare Workers support and current deployment options for Rox.
---

# Rox December 2025 Update

We'd like to share some important updates about Rox's development and deployment options.

## Deployment Options Update

### Cloudflare Workers Support Discontinued

> [!IMPORTANT]
> Cloudflare Workers support has been **discontinued**. Please use VPS Docker or Bare Metal deployment instead.

We have decided to discontinue development of **Cloudflare Workers support**. While our previous documentation mentioned edge deployment as an option, we've determined that focusing on VPS deployment provides a better experience for most use cases.

### Current Deployment Options

Rox now officially supports two deployment methods:

1. **Docker Compose** (Recommended)
   - Easy setup and management
   - Isolated services
   - Consistent across different Linux distributions
   - Best for most users

2. **Bare Metal**
   - Direct installation on your server
   - Maximum performance
   - No container overhead
   - Best for experienced administrators

For detailed deployment instructions, please refer to our updated [Deployment Guide](/docs/deployment).

## Database Support

Rox continues to support multiple databases:

- **PostgreSQL** - Recommended for production
- **MySQL** - Alternative option
- **SQLite** - Easy setup for personal instances

## Version Progress

The project has progressed to version **2025.12.0-rc.7**, with significant improvements in stability and performance.

## Documentation Updates

We've updated the following documentation pages to reflect these changes:

- [Deployment Guide](/docs/deployment)
- [Introduction](/docs/introduction)
- [Architecture Guide](/docs/architecture)
- [Configuration Guide](/docs/configuration)

## Thank You

Thank you for your continued support of the Rox project. We remain committed to building a lightweight, modern ActivityPub server that's easy to deploy and maintain.

If you have any questions or feedback, please reach out via our [GitHub repository](https://github.com/Love-Rox/rox).

**The Love Rocks. Rox.**
