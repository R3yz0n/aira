# User Management (Admin) — API Documentation

This document describes the single-admin user management system and utilities implemented in this project. The system is intentionally simple: it supports a single admin user whose email is provided via environment variables.

**Admin setup and password update are now performed via scripts, not API.**
Use the scripts to create the admin (one-time) and update the password. The API is used for login and password change (with JWT) only.

## Environment variables

- `MONGODB_URI` (required): MongoDB connection string.
- `ADMIN_EMAIL` (required): The single admin email address allowed by the API.
- `JWT_SECRET` (required): Secret used to sign JWT tokens.
- `ADMIN_SETUP_SECRET` (optional): If set, the initial setup call requires this secret.
- `ADMIN_SCRIPT_SECRET` (optional): If set, the CLI password script must be called with this secret.

## Files / helpers

- `lib/mongodb.ts` — serverless-friendly MongoDB connection helper. Use `getDb()` from server code.
- `lib/hash.ts` — `hashPassword` and `verifyPassword` wrappers around `bcryptjs`.
- `lib/jwt.ts` — `signToken` and `verifyToken` helpers using `jsonwebtoken`.

## Admin Setup (Script)

**Do not use the API for admin creation. Use the provided script:**

- `scripts/create-admin.mjs` — Node script to create the initial admin directly in MongoDB.
- `scripts/admin-setup.sh` — Bash helper for the above (makes it easy to call with env vars).

Usage:

```bash
# Make sure ADMIN_EMAIL, MONGODB_URI, and (optionally) ADMIN_SETUP_SECRET are set in your .env.local or environment

# Using the Node script directly:
node scripts/create-admin.mjs StrongPass123 optional-setup-secret

# Or using the Bash helper (recommended):
chmod +x scripts/admin-setup.sh
./scripts/admin-setup.sh StrongPass123 optional-setup-secret
```

- The script will refuse to run if an admin already exists.
- If `ADMIN_SETUP_SECRET` is set in env, you must provide it as the second argument.

### POST /api/admin/login

Purpose: Authenticate admin and get a JWT access token.

Request body:

```
{ "email": "admin@example.com", "password": "StrongPass123" }
```

Response on success (200):

```
{ "success": true, "data": { "token": "<JWT>" } }
```

Error responses:

- 400 Bad Request — `{ "success": false, "error": { "code": "INVALID_INPUT", "message": "Invalid input", "details": <zod issues> } }`
- 401 Unauthorized — `{ "success": false, "error": { "code": "INVALID_CREDENTIALS", "message": "Invalid credentials" } }`
- 500 Internal Server Error — `{ "success": false, "error": { "code": "INTERNAL_ERROR", "message": "Internal server error" } }`

Implementation: `app/api/admin/login/route.ts`.

### POST /api/admin/change-password

Purpose: Change the admin password. Requires a valid Bearer token.

Headers:

- `Authorization: Bearer <token>` — token from login endpoint.

Request body:

```
{ "oldPassword": "OldPass123", "newPassword": "NewPass456" }
```

Responses:

- 200 OK — password changed
- 400 Bad Request — missing fields or new password too short
- 401 Unauthorized — invalid token or old password incorrect
- 404 Not Found — admin not found

Implementation: `app/api/admin/change-password/route.ts`.

## CLI: set-admin-password.mjs

Purpose: Update the admin password directly in the database (out-of-band, script-only).

Scripts:

- `scripts/set-admin-password.mjs` — Node script to update the admin password.
- `scripts/update-admin-password.sh` — Bash helper for the above.

Usage:

```bash
# Using the Node script directly:
node scripts/set-admin-password.mjs NEW_PASSWORD optional-script-secret

# Or using the Bash helper:
chmod +x scripts/update-admin-password.sh
./scripts/update-admin-password.sh NEW_PASSWORD optional-script-secret
```

- Requires `MONGODB_URI` and `ADMIN_EMAIL` in env.
- If `ADMIN_SCRIPT_SECRET` is set in env, pass the same secret as the second arg.

## Security recommendations

- Use HTTPS and a strong `JWT_SECRET` in production.
- Limit privileges of the MongoDB user to only required operations.
- Rotate `JWT_SECRET` and admin passwords periodically.
- Remove or rotate `ADMIN_SETUP_SECRET` after initial setup.

## Examples

Create admin (one-time, script):

```bash
# Node script
node scripts/create-admin.mjs StrongPass123 optional-setup-secret
# or Bash helper
./scripts/admin-setup.sh StrongPass123 optional-setup-secret
```

Login:

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"StrongPass123"}'
```

Change password (API):

```bash
curl -X POST http://localhost:3000/api/admin/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  -d '{"oldPassword":"StrongPass123","newPassword":"NewPass456"}'

# Or change password directly in DB (script):
node scripts/set-admin-password.mjs NewPass456 optional-script-secret
# or
./scripts/update-admin-password.sh NewPass456 optional-script-secret
```

## Where to go next

- Add rate limiting and audit logging for the admin endpoints.
- Consider 2FA or IP allowlisting for extra protection.
- Add integration tests for the auth flows.
