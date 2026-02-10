# User Management (Admin) — API Documentation

This document describes the dual-user system implemented in this project:

- **Admin user**: Full access (create, read, update, delete)
- **Guest user**: Read-only access to all GET endpoints

Both users are created during initial setup via script. The API is used for login and password changes only.

**Note:** Admin setup is performed via script (one-time). The API is used for login and password changes (with JWT) only.

## Environment variables

- `MONGODB_URI` (required): MongoDB connection string.
- `ADMIN_EMAIL` (required): Email of the initial admin user to create during setup (one-time only).
- `JWT_SECRET` (required): Secret used to sign JWT tokens.
- `ADMIN_SETUP_SECRET` (optional): If set, the initial setup call requires this secret.
- `ADMIN_SCRIPT_SECRET` (optional): If set, the CLI password script must be called with this secret.

## Files / helpers

- `lib/mongodb.ts` — serverless-friendly MongoDB connection helper. Use `getDb()` from server code.
- `lib/hash.ts` — `hashPassword` and `verifyPassword` wrappers around `bcryptjs`.
- `lib/jwt.ts` — `signToken` and `verifyToken` helpers using `jsonwebtoken`.

## Admin Setup (Script)

**Initial setup creates both users via script (one-time only):**

- `scripts/create-admin.ts` — Creates both admin and guest users in MongoDB.
- `scripts/admin-setup.sh` — Bash helper for the above (recommended).

Usage:

```bash
# Make sure ADMIN_EMAIL, MONGODB_URI, and (optionally) ADMIN_SETUP_SECRET are set in .env.local

# Using Bash helper (recommended):
chmod +x scripts/admin-setup.sh
./scripts/admin-setup.sh YourAdminPassword [optional-setup-secret]
```

This creates:

- **Admin user** — email from `ADMIN_EMAIL` env var (setup-time only), specified password, role: `admin`
- **Guest user** — email: `test@test.com`, password: `test@1234`, role: `guest` (read-only)

After setup, login authenticates any user in the database by email/password lookup. There is no email allowlist in the API.

### POST /api/admin/login

Purpose: Authenticate a user (admin or guest) and get a JWT access token.

Request body:

```json
{ "email": "admin@example.com", "password": "YourPassword" }
```

Response on success (200):

```json
{ "success": true, "data": { "token": "<JWT>", "role": "admin" } }
```

The JWT token payload includes:

- `email` — user email
- `role` — either `"admin"` or `"guest"`

**Note:** Guest user has read-only access. Mutations (POST/PUT/DELETE) will return 403 Forbidden.

Error responses:

- 400 Bad Request — `{ "success": false, "error": { "code": "INVALID_INPUT", "message": "Invalid input", "details": <zod issues> } }`
- 401 Unauthorized — `{ "success": false, "error": { "code": "INVALID_CREDENTIALS", "message": "Invalid credentials" } }`
- 500 Internal Server Error — `{ "success": false, "error": { "code": "INTERNAL_ERROR", "message": "Internal server error" } }`

Implementation: `app/api/admin/login/route.ts`.

### POST /api/admin/change-password

Purpose: Change password for authenticated user (admin or guest). Requires a valid Bearer token.

Headers:

- `Authorization: Bearer <token>` — token from login endpoint.

Request body:

```json
{ "oldPassword": "CurrentPassword", "newPassword": "NewPassword" }
```

Responses:

- 200 OK — password changed
- 400 Bad Request — missing fields or new password too short
- 401 Unauthorized — invalid token or old password incorrect
- 404 Not Found — user not found

Implementation: `app/api/admin/change-password/route.ts`.

## Role-Based Access Control

### Public Routes (No Authentication Required)

Public API endpoints (`/api/public/*`) do not require authentication. All users (authenticated or not) have the same access.

### Protected Routes (Authentication Required)

Admin dashboard and admin API endpoints (`/api/admin/*`, `/admin`) require authentication via Bearer token.

Access is controlled by role:

| Method | No Token | Admin Role | Guest Role   |
| ------ | -------- | ---------- | ------------ |
| GET    | 401      | ✓ Allow    | ✓ Allow      |
| POST   | 401      | ✓ Allow    | ✗ Deny (403) |
| PUT    | 401      | ✓ Allow    | ✗ Deny (403) |
| DELETE | 401      | ✓ Allow    | ✗ Deny (403) |

**Admin users** on protected routes can:

- View all resources (GET)
- Create events, categories, bookings (POST)
- Update events, categories (PUT)
- Delete events, categories, bookings (DELETE)
- Change their own password

**Guest users** on protected routes can:

- View all resources (GET only)
- Access admin dashboard (read-only view)
- Change their own password
- **Cannot** create, update, or delete any resources

**Unauthenticated users** on protected routes:

- Return 401 Unauthorized for all requests
- Must login first to access admin panel

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

### Initial Setup (Creates both users)

```bash
./scripts/admin-setup.sh MySecureAdminPassword
```

Output:

```
✓ Admin created for admin@example.com
✓ Guest user created for test@test.com
  Email: test@test.com
  Password: test@1234
  Role: guest (read-only access)
```

### Admin Login

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"MySecureAdminPassword"}' | jq .
```

Response:

```json
{ "success": true, "data": { "token": "eyJhbG...", "role": "admin" } }
```

### Guest Login

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test@1234"}' | jq .
```

Response:

```json
{ "success": true, "data": { "token": "eyJhbG...", "role": "guest" } }
```

### Guest Attempts Write Operation (Forbidden)

Guest can read:

```bash
curl -X GET http://localhost:3000/api/admin/events \
  -H "Authorization: Bearer <guest-token>" | jq .
# ✓ Returns 200 with events list
```

Guest cannot write:

```bash
curl -X POST http://localhost:3000/api/admin/events \
  -H "Authorization: Bearer <guest-token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Event"}' | jq .
# ✗ Returns 403 Forbidden
```

### Change Password (Admin or Guest)

```bash
curl -X POST http://localhost:3000/api/admin/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"oldPassword":"test@1234","newPassword":"NewPassword456"}' | jq .
```

### Update Admin Password (Script)

```bash
./scripts/update-admin-password.sh NewAdminPassword
```

## Where to go next

- Implement role-based middleware to enforce permissions on all routes.
- Add more roles (e.g., `editor`, `viewer`) as needed.
- Add rate limiting and audit logging for admin endpoints.
- Consider 2FA or IP allowlisting for extra protection.
- Add integration tests for role-based access control.
