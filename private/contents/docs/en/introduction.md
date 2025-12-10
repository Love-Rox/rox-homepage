---
title: Introduction to Rox
description: Learn about Rox, a lightweight ActivityPub server and client with Misskey API compatibility
date: 2025-12-10
author: Rox Team
tags: [introduction, overview, activitypub, misskey]
---

# Introduction to Rox

Rox is a lightweight ActivityPub server & client with Misskey API compatibility, designed for modern deployment scenarios.

## What is Rox?

Rox is a next-generation federated social media platform that combines:

- **ActivityPub Protocol**: Full federation with Mastodon, Misskey, GoToSocial, and other ActivityPub-compatible servers
- **Misskey API Compatibility**: Seamless migration path for existing Misskey users and clients
- **Modern Architecture**: Built with cutting-edge technologies for performance and developer experience
- **Deployment Flexibility**: Run on traditional VPS with Docker or bare metal installation

## Key Features

### Lightweight & High Performance
Built with Bun runtime and modern web standards for exceptional speed and efficiency. The entire backend is designed to be fast and resource-efficient.

### Infrastructure Agnostic
Deploy Rox anywhere:
- **Traditional VPS**: Use Docker Compose for easy deployment
- **Bare Metal**: Direct installation for maximum performance

### Misskey API Compatible
Full compatibility with the Misskey API means:
- Existing Misskey clients work out of the box
- Easy migration from Misskey instances
- Familiar API for developers

### Multi-Database Support
Choose the database that fits your deployment:
- **PostgreSQL**: Recommended for production
- **MySQL**: Alternative relational database
- **SQLite**: For easy setup and personal instances

### Flexible Storage
Store media files where you want:
- **Local Filesystem**: Simple and fast for single-server deployments
- **S3-Compatible Storage**: AWS S3, Cloudflare R2, MinIO for scalability

### Modern UI
Beautiful, accessible interface built with:
- **Waku**: React Server Components framework
- **React Aria Components**: Accessible headless UI components
- **Tailwind CSS v4**: Modern styling with OKLCH color space
- **Lingui**: Optimized internationalization (English/Japanese)

## Architecture Overview

Rox uses proven design patterns for maintainability and testability:

### Repository Pattern
Database operations are abstracted through interfaces:
- `INoteRepository` - Note/post operations
- `IUserRepository` - User management
- `IFileRepository` - File handling
- And more...

### Adapter Pattern
Storage operations use adapters for flexibility:
- `LocalStorageAdapter` - Local filesystem storage
- `S3StorageAdapter` - S3-compatible storage

### Dependency Injection
Implementations are injected via Hono Context based on environment variables, making it easy to switch between different implementations without code changes.

## Project Structure

```
rox/
├── packages/
│   ├── backend/   # Hono Rox (API server)
│   ├── frontend/  # Waku Rox (web client)
│   └── shared/    # Common types and utilities
├── docs/          # Documentation
├── docker/        # Docker configurations
└── scripts/       # Build and deployment scripts
```

## Technology Stack

### Backend
- **Runtime**: Bun 1.1.45+
- **Language**: TypeScript 5.x
- **Framework**: Hono 4.10.6
- **ORM**: Drizzle ORM 0.36.4
- **Queue**: Dragonfly / BullMQ
- **Code Quality**: oxc

### Frontend
- **Framework**: Waku 0.27.1
- **State Management**: Jotai 2.15.1
- **UI Components**: React Aria Components 1.6.3
- **Styling**: Tailwind CSS v4 4.1.17
- **Internationalization**: Lingui 5.6.0
- **Authentication**: Passkey + Password

## Use Cases

Rox is perfect for:

1. **Personal Instances**: Run your own federated social media server
2. **Community Platforms**: Build communities with ActivityPub federation
3. **Misskey Migration**: Migrate from Misskey with minimal disruption
4. **Development**: Learn about ActivityPub and federated systems

## Next Steps

Ready to get started? Check out these guides:

- [Getting Started](getting-started) - Set up Rox locally
- [Architecture](architecture) - Deep dive into the architecture
- [Deployment](deployment) - Deploy Rox to production
- [API Reference](api-overview) - Explore the API

## Community

- **GitHub**: [Love-Rox/rox](https://github.com/Love-Rox/rox)
- **Documentation**: [Implementation Guide](https://github.com/Love-Rox/rox/blob/main/docs/implementation/README.md)
- **Contributing**: [Contributing Guide](https://github.com/Love-Rox/rox/blob/main/CONTRIBUTING.md)

## License

Rox is open source software licensed under the MIT License.

---

## Update History

| Date | Changes |
|------|---------|
| 2025-12-10 | Removed Cloudflare Workers/edge deployment references (development discontinued) |
