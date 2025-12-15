# User Management (Admin) — API Documentation

This document describes the single-admin user management endpoints and utilities
implemented in this project. The system is intentionally simple: it supports a
single admin user whose email is provided via environment variables. Use the
endpoints to create the admin (one-time), authenticate (login), and change the
password. A CLI script is included for out-of-band password rotation.

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

## API Endpoints

All routes are under `/api/admin`.

### POST /api/admin/setup

Purpose: Create the single admin user. This should be executed only once.

Request body (JSON):

```
{
  "email": "admin@example.com",
  "password": "StrongPass123",
  "setupSecret": "optional-setup-secret"
}
```

Rules:

- `email` must exactly match `ADMIN_EMAIL` in environment.
- If `ADMIN_SETUP_SECRET` is set, `setupSecret` must match it.
- Password must be at least 8 characters.

Responses:

- 201 Created — admin created
- 400 Bad Request — invalid or too-short password
- 403 Forbidden — email mismatch or bad setup secret
- 409 Conflict — admin already exists

Implementation: `app/api/admin/setup/route.ts`.

### POST /api/admin/login

Purpose: Authenticate admin and get a JWT access token.

Request body:

```
{ "email": "admin@example.com", "password": "StrongPass123" }
```

Response on success:

```
{ "token": "<JWT>" }
```

Status codes:

- 200 OK — returns token
- 400 Bad Request — missing fields
- 401 Unauthorized — invalid credentials

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

Purpose: Update the admin password directly in the database (out-of-band).

Usage:

```bash
node scripts/set-admin-password.mjs NEW_PASSWORD SCRIPT_SECRET
# or
npm run set-admin-password -- NEW_PASSWORD SCRIPT_SECRET
```

Notes:

- Requires `MONGODB_URI` and `ADMIN_EMAIL` in env.
- If `ADMIN_SCRIPT_SECRET` is set in env, pass the same secret as the second arg.

## Security recommendations

- Use HTTPS and a strong `JWT_SECRET` in production.
- Limit privileges of the MongoDB user to only required operations.
- Rotate `JWT_SECRET` and admin passwords periodically.
- Remove or rotate `ADMIN_SETUP_SECRET` after initial setup.

## Examples

Create admin (one-time):

```bash
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"StrongPass123","setupSecret":"mysetup"}'
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
```

## Where to go next

- Add rate limiting and audit logging for the admin endpoints.
- Consider 2FA or IP allowlisting for extra protection.
- Add integration tests for the auth flows.
