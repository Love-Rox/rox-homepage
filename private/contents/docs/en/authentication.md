---
title: Authentication Guide
description: Learn how authentication works in Rox, including Passkeys and Password support.
date: 2025-01-01
author: Rox Team
tags: [authentication, security, passkeys, password]
---

# Authentication Guide

Rox provides a secure and flexible authentication system supporting both modern Passkeys (WebAuthn) and traditional passwords.

## Overview

Authentication in Rox is handled by the backend API and integrated seamlessly into the frontend client. We prioritize security best practices, including:

- **JWT (JSON Web Tokens)** for stateless session management
- **Bcrypt** for secure password hashing
- **WebAuthn** for passwordless authentication (Passkeys)
- **Rate Limiting** to prevent brute-force attacks

## Authentication Methods

### 1. Passkeys (Recommended)

Passkeys provide the highest level of security and convenience. Users can sign in using their device's biometric authentication (FaceID, TouchID) or hardware security keys.

#### Registration Flow
1. User enters username.
2. Server generates a challenge.
3. Browser prompts user for biometric/device auth.
4. Public key is sent to server and stored.

#### Login Flow
1. User enters username.
2. Server sends challenge.
3. Browser signs challenge with private key.
4. Server verifies signature and issues JWT.

### 2. Password Authentication

For users who prefer traditional methods or don't have compatible devices, Rox supports password-based authentication.

- **Requirements**: Minimum 8 characters
- **Storage**: Bcrypt hashing with salt
- **Security**: Rate-limited login attempts

## Client Implementation

The Rox frontend (Waku) uses a dedicated `auth` store (Jotai atom) to manage authentication state.

```typescript
// Example: Checking login state
const [user] = useAtom(currentUserAtom);

if (user) {
  console.log('Logged in as:', user.username);
}
```

## API Endpoints

### Registration

- `POST /api/signup` - Create a new account
- `POST /api/auth/register/options` - Get WebAuthn registration options
- `POST /api/auth/register/verify` - Verify WebAuthn registration

### Login

- `POST /api/signin` - Login with password
- `POST /api/auth/login/options` - Get WebAuthn login options
- `POST /api/auth/login/verify` - Verify WebAuthn login

### Session

- `POST /api/signout` - Invalidate current session
- `POST /api/i` - Get current user profile

## Security Configuration

Administrators can configure authentication settings in `.env`:

```bash
# JWT Configuration
JWT_SECRET=your-secure-secret
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_LOGIN_WINDOW=15m
RATE_LIMIT_LOGIN_MAX=5
```

## Troubleshooting

### "Authentication Failed"
- Check if cookies are enabled in your browser.
- Ensure your system clock is synchronized (for TOTP/WebAuthn).
- Verify that `JWT_SECRET` matches between backend and frontend (if separate).

### Passkey Issues
- Ensure your device supports WebAuthn.
- Try using a different browser or device.
- Check if the domain is served over HTTPS (required for WebAuthn).
