# Aira Events

Event management platform built with Next.js 14, TypeScript, and MongoDB.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Styling:** Tailwind CSS + shadcn/ui
- **Authentication:** JWT
- **Validation:** Zod

## Project Structure

```
aira/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   └── (pages)/            # Page components
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   └── layout/             # Layout components
├── domain/                 # Domain types & Zod schemas
├── hooks/                  # React hooks
├── lib/                    # Utilities & infrastructure
│   ├── api/                # API client & response handlers
│   ├── auth/               # JWT & password hashing
│   ├── db/                 # Database connection
│   ├── models/             # Mongoose models
│   └── types/              # TypeScript types
├── repositories/           # Data access layer
└── services/               # Business logic layer
```

## Architecture

The project follows a **Clean/Layered Architecture** pattern:

```
┌──────────────────────────────────────────────────────────┐
│  CLIENT (Browser)                                        │
└──────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│  HOOK LAYER                                              │
│  React state, UI feedback, navigation                    │
│  Example: hooks/use-admin-login.ts                       │
└──────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│  API CLIENT LAYER                                        │
│  HTTP calls, error transformation, token storage         │
│  Example: lib/api/admin-auth.ts                          │
└──────────────────────────────────────────────────────────┘
                              │
                      HTTP Request/Response
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│  ROUTE LAYER (API Routes)                                │
│  Request parsing, validation, response formatting        │
│  Example: app/api/admin/login/route.ts                   │
└──────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│  SERVICE LAYER                                           │
│  Business logic, orchestration                           │
│  Example: services/admin/auth-service.ts                 │
└──────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│  REPOSITORY LAYER                                        │
│  Data access, database abstraction                       │
│  Example: repositories/admin-repository.ts               │
└──────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│  DOMAIN LAYER                                            │
│  Types, interfaces, validation schemas                   │
│  Example: domain/admin.ts                                │
└──────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer          | Responsibility                              |
| -------------- | ------------------------------------------- |
| **Domain**     | Types, Zod schemas, pure business rules     |
| **Repository** | Data access, hides database implementation  |
| **Service**    | Business logic, orchestrates repositories   |
| **Route**      | HTTP layer, validation, response formatting |
| **API Client** | Client-side HTTP, error transformation      |
| **Hook**       | React state, UI integration                 |

## Documentation

For detailed API documentation and user management guidelines, refer to the following files:

- [API Documentation](docs/API_DOCS.md)
- [User Management Documentation](docs/UserManagement.md)

## Scripts

| Command                | Description              |
| ---------------------- | ------------------------ |
| `npm run dev`          | Start development server |
| `npm run build`        | Build for production     |
| `npm run start`        | Start production server  |
| `npm run lint`         | Run ESLint               |
| `npm run create-admin` | Create admin user        |

## License

Private
