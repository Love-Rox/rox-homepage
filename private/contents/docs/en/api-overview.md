---
title: API Reference
description: Complete Misskey-compatible API reference for Rox
date: 2025-01-01
author: Rox Team
tags: [api, reference, misskey, endpoints]
---

# API Reference

Rox provides a Misskey-compatible API for seamless integration with existing Misskey clients.

## Base URL

```
https://api.your-domain.com
```

## Authentication

### Create Account

```http
POST /api/signup
Content-Type: application/json

{
  "username": "alice",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "id": "user_123",
  "username": "alice",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

```http
POST /api/signin
Content-Type: application/json

{
  "username": "alice",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "username": "alice",
    "displayName": "Alice"
  }
}
```

### Using Tokens

Include the token in the `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Notes (Posts)

### Create Note

```http
POST /api/notes/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Hello, Fediverse!",
  "visibility": "public",
  "fileIds": ["file_123"],
  "cw": "Content warning text (optional)",
  "replyId": "note_456 (optional)",
  "renoteId": "note_789 (optional)"
}
```

**Parameters:**
- `text` (string): Note content
- `visibility` (string): `public`, `home`, `followers`, `specified`
- `fileIds` (array): Array of uploaded file IDs
- `cw` (string, optional): Content warning
- `replyId` (string, optional): ID of note to reply to
- `renoteId` (string, optional): ID of note to renote

**Response:**
```json
{
  "createdNote": {
    "id": "note_123",
    "text": "Hello, Fediverse!",
    "userId": "user_123",
    "visibility": "public",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Get Timeline

```http
POST /api/notes/timeline
Authorization: Bearer {token}
Content-Type: application/json

{
  "limit": 20,
  "sinceId": "note_100",
  "untilId": "note_200"
}
```

**Parameters:**
- `limit` (number): Number of notes (max 100)
- `sinceId` (string, optional): Get notes after this ID
- `untilId` (string, optional): Get notes before this ID

**Response:**
```json
[
  {
    "id": "note_123",
    "text": "Hello!",
    "user": {
      "id": "user_123",
      "username": "alice",
      "displayName": "Alice"
    },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "reactions": {
      "👍": 5,
      "❤️": 3
    }
  }
]
```

### Delete Note

```http
POST /api/notes/delete
Authorization: Bearer {token}
Content-Type: application/json

{
  "noteId": "note_123"
}
```

### React to Note

```http
POST /api/notes/reactions/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "noteId": "note_123",
  "reaction": "👍"
}
```

### Remove Reaction

```http
POST /api/notes/reactions/delete
Authorization: Bearer {token}
Content-Type: application/json

{
  "noteId": "note_123"
}
```

## Users

### Get User Info

```http
POST /api/users/show
Content-Type: application/json

{
  "username": "alice"
}
```

**Response:**
```json
{
  "id": "user_123",
  "username": "alice",
  "displayName": "Alice",
  "description": "Bio text",
  "avatarUrl": "https://example.com/avatar.jpg",
  "bannerUrl": "https://example.com/banner.jpg",
  "followersCount": 100,
  "followingCount": 50,
  "notesCount": 500
}
```

### Get Current User

```http
POST /api/i
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "user_123",
  "username": "alice",
  "displayName": "Alice",
  "email": "alice@example.com"
}
```

### Update Profile

```http
POST /api/i/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "displayName": "Alice Smith",
  "description": "New bio",
  "avatarId": "file_123",
  "bannerId": "file_456"
}
```

## Following

### Follow User

```http
POST /api/following/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_456"
}
```

### Unfollow User

```http
POST /api/following/delete
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_456"
}
```

### Get Followers

```http
POST /api/users/followers
Content-Type: application/json

{
  "userId": "user_123",
  "limit": 20
}
```

### Get Following

```http
POST /api/users/following
Content-Type: application/json

{
  "userId": "user_123",
  "limit": 20
}
```

## Files

### Upload File

```http
POST /api/drive/files/create
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary data]
name: "image.jpg"
isSensitive: false
```

**Response:**
```json
{
  "id": "file_123",
  "name": "image.jpg",
  "type": "image/jpeg",
  "md5": "abc123...",
  "size": 123456,
  "url": "https://example.com/files/image.jpg",
  "thumbnailUrl": "https://example.com/files/thumb_image.jpg"
}
```

### Delete File

```http
POST /api/drive/files/delete
Authorization: Bearer {token}
Content-Type: application/json

{
  "fileId": "file_123"
}
```

## Federation (ActivityPub)

### WebFinger

```http
GET /.well-known/webfinger?resource=acct:alice@your-domain.com
```

**Response:**
```json
{
  "subject": "acct:alice@your-domain.com",
  "links": [
    {
      "rel": "self",
      "type": "application/activity+json",
      "href": "https://your-domain.com/users/alice"
    }
  ]
}
```

### Actor (User Profile)

```http
GET /users/alice
Accept: application/activity+json
```

**Response:**
```json
{
  "@context": "https://www.w3.org/ns/activitystreams",
  "type": "Person",
  "id": "https://your-domain.com/users/alice",
  "inbox": "https://your-domain.com/users/alice/inbox",
  "outbox": "https://your-domain.com/users/alice/outbox",
  "followers": "https://your-domain.com/users/alice/followers",
  "following": "https://your-domain.com/users/alice/following"
}
```

## Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Authenticated**: 200 requests per 15 minutes per user

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## Error Responses

### 400 Bad Request

```json
{
  "error": {
    "message": "Invalid request",
    "code": "INVALID_PARAM",
    "id": "request_123"
  }
}
```

### 401 Unauthorized

```json
{
  "error": {
    "message": "Authentication required",
    "code": "AUTHENTICATION_FAILED"
  }
}
```

### 403 Forbidden

```json
{
  "error": {
    "message": "Permission denied",
    "code": "PERMISSION_DENIED"
  }
}
```

### 404 Not Found

```json
{
  "error": {
    "message": "Resource not found",
    "code": "NOT_FOUND"
  }
}
```

### 429 Too Many Requests

```json
{
  "error": {
    "message": "Rate limit exceeded",
    "code": "RATE_LIMIT_EXCEEDED"
  }
}
```

## Webhooks

### Register Webhook

```http
POST /api/webhooks/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["note", "follow", "mention"],
  "secret": "webhook_secret"
}
```

### Webhook Payload

```json
{
  "type": "note",
  "data": {
    "id": "note_123",
    "text": "Hello!",
    "userId": "user_123"
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## Streaming API

### WebSocket Connection

```javascript
const ws = new WebSocket('wss://api.your-domain.com/streaming');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'connect',
    body: {
      channel: 'homeTimeline',
      token: 'your_token'
    }
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('New event:', data);
};
```

### Available Channels

- `homeTimeline` - Home timeline updates
- `localTimeline` - Local timeline updates
- `globalTimeline` - Global timeline updates
- `main` - General notifications

## SDK Examples

### JavaScript/TypeScript

```typescript
import { RoxClient } from '@rox/sdk';

const client = new RoxClient({
  baseUrl: 'https://api.your-domain.com',
  token: 'your_token'
});

// Create note
const note = await client.notes.create({
  text: 'Hello from SDK!'
});

// Get timeline
const timeline = await client.notes.timeline({
  limit: 20
});
```

### cURL

```bash
# Create note
curl -X POST https://api.your-domain.com/api/notes/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello from cURL!"}'
```

## Next Steps

- [Authentication Guide](authentication) - Detailed authentication flows
- [Federation Guide](federation) - ActivityPub federation details
- [Deployment Guide](deployment) - Deploy your instance
