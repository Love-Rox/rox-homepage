---
title: Federation Guide
description: Understand how Rox federates with other ActivityPub servers like Mastodon and Misskey.
date: 2025-01-01
author: Rox Team
tags: [federation, activitypub, mastodon, misskey]
---

# Federation Guide

Rox is built on the **ActivityPub** protocol, allowing it to communicate and exchange content with thousands of other servers in the Fediverse (Federated Universe).

## How Federation Works

When a user on your Rox instance follows a user on another server (e.g., `mastodon.social`), the servers exchange messages to:

1.  **Subscribe**: Your server asks the remote server to send updates.
2.  **Deliver**: When the remote user posts, their server pushes the activity to your server's **Inbox**.
3.  **Process**: Your server processes the activity and adds it to your user's timeline.

### Supported Activities

Rox supports the following ActivityPub activities:

- `Create` (Notes/Posts)
- `Delete` (Notes)
- `Follow` / `Undo Follow`
- `Like` / `Undo Like`
- `Announce` (Renote/Boost)
- `Update` (Profile updates)

## Configuration

Federation is enabled by default but can be configured in your `.env` file.

### Basic Settings

```bash
# Enable/Disable Federation
FEDERATION_ENABLED=true

# Shared Inbox (Recommended for performance)
SHARED_INBOX_ENABLED=true
```

### Allow/Block Lists

You can control which instances your server communicates with.

```bash
# Allow List (If set, only these domains are allowed)
FEDERATION_ALLOWLIST=mastodon.social,misskey.io

# Block List (These domains are blocked)
FEDERATION_BLOCKLIST=spam-instance.com,bad-actors.net
```

## Discovery

### WebFinger

Rox implements **WebFinger** (RFC 7033) to allow users to be discovered by their handle (e.g., `@alice@your-domain.com`).

Endpoint: `/.well-known/webfinger?resource=acct:user@domain.com`

### NodeInfo

Rox provides **NodeInfo** metadata to help other servers and crawlers understand your instance's capabilities and software version.

Endpoint: `/.well-known/nodeinfo`

## Troubleshooting Federation

### "Remote user not found"
- Verify the handle format: `@username@domain.com`.
- Check if the remote instance is online.
- Ensure your server can make outbound HTTPS requests.

### "Posts not arriving"
- Check your background job queue (BullMQ/Dragonfly). Federation delivery is asynchronous.
- Verify that your `SHARED_INBOX` is accessible from the internet.
- Check for signature verification errors in the logs.

### "Signature verification failed"
- Ensure your system time is accurate (NTP).
- Check if your SSL certificate is valid.
- Verify that your instance keys were generated correctly during setup.
