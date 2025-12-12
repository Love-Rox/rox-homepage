---
title: Contributing Guide
description: Learn how to contribute to Rox, set up your development environment, and submit pull requests.
date: 2025-01-01
author: Rox Team
tags: [contributing, development, open source]
---

# Contributing to Rox

Thank you for your interest in contributing to Rox! We welcome contributions from the community to help make Rox better.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](https://github.com/Love-Rox/rox/blob/main/CODE_OF_CONDUCT.md). Please treat everyone with respect and kindness.

## Getting Started

### Prerequisites

- **Bun**: v1.0.0 or higher
- **Node.js**: v18 or higher (for some tools)
- **Docker**: For running the database and services

### Setting Up Your Environment

#### Option A: Using DevContainer (Recommended)

If you're using VS Code or GitHub Codespaces, you can set up your development environment with just one click using DevContainer.

1. Fork and clone the repository
2. Open the folder in VS Code
3. Select "Reopen in Container"
4. Once auto-setup completes, run `bun run dev` to start developing

See the [Getting Started Guide](getting-started) for more details.

#### Option B: Manual Setup

1.  **Fork the repository** on GitHub.
2.  **Clone your fork**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/rox.git
    cd rox
    ```
3.  **Install dependencies**:
    ```bash
    bun install
    ```
4.  **Start the database**:
    ```bash
    docker compose up -d
    ```
5.  **Run migrations**:
    ```bash
    bun run db:migrate
    ```
6.  **Start the development server**:
    ```bash
    bun run dev
    ```

The backend API will be available at `http://localhost:3000`, and the frontend client at `http://localhost:3001`.

## Development Workflow

1.  **Create a branch** for your feature or fix:
    ```bash
    git checkout -b feature/my-new-feature
    ```
2.  **Make your changes**. Ensure you follow the project's coding style.
3.  **Run tests** to ensure no regressions:
    ```bash
    bun test
    ```
4.  **Commit your changes** using conventional commits:
    ```bash
    git commit -m "feat: add new awesome feature"
    ```
5.  **Push to your fork**:
    ```bash
    git push origin feature/my-new-feature
    ```
6.  **Open a Pull Request** on the main repository.

## Project Structure

- `src/backend`: Hono API server
- `src/frontend`: Waku client application
- `src/shared`: Shared types and utilities
- `drizzle`: Database schema and migrations

## Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub. Provide as much detail as possible, including steps to reproduce the issue.

## License

By contributing, you agree that your contributions will be licensed under the project's [AGPL-3.0 License](https://github.com/Love-Rox/rox/blob/main/LICENSE).

---

## Update History

| Date | Changes |
|------|---------|
| 2025-12-12 | Added DevContainer option, corrected license to AGPL-3.0 |
