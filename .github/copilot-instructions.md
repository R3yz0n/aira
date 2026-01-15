# GitHub Copilot Custom Instructions for Next.js Applications

This repository is a modern Next.js (version 15+) application using the **App Router**. Follow these instructions strictly to ensure high-quality, maintainable, scalable, and performant code.

## Project Overview

- Language: TypeScript (strict mode enabled)
- UI Components: Prefer shadcn/ui, Radix UI primitives, or similar accessible components
- Architecture Goals: Modular, well-documented, decoupled, and following clean system design principles
- Data Fetching: Prefer Server Components and Server Actions; minimize client-side fetching
- API: If internal Route Handlers are used (`app/api/`), keep them thin and decoupled. Prefer external decoupled backend APIs via service layer for better separation.

## Core Principles

- **Server Components by Default**: All components in `app/` are Server Components unless interactivity is required.
- **Client Components Only When Necessary**: Add `'use client'` at the top only for components using state (useState, useEffect), browser APIs, or client-side hooks.
- **Modularity & Decoupling**:
  - Separate concerns: UI, logic, data access, services.
  - Keep business logic out of components — move to `/lib`, `/utils`, `/services`, or custom hooks.
  - For external APIs: Create dedicated service files in `/services/api/` that handle fetching, authentication, and error handling.
  - Avoid tight coupling: Use interfaces/types for contracts between layers.
- **Type Safety**: Always use TypeScript. No `any` types. Prefer interfaces over types for objects. Use Zod for runtime validation (especially forms and API responses).
- **Performance**:
  - Use React Server Components and streaming where possible.
  - Leverage built-in Next.js optimizations (next/image, next/link, metadata API).
  - Cache fetches appropriately with `fetch` options or `revalidate`.
- **Accessibility & Best Practices**:
  - Semantic HTML.
  - ARIA attributes where needed.
  - Mobile-first responsive design with Tailwind.
  - Proper loading and error states (`loading.js`, `error.js`, Suspense).
- **Documentation**:
  - Add JSDoc comments for complex functions/components.
  - Keep README updated with setup, architecture overview, and key decisions.

## Layered Architecture Guidelines (for API & Server-Side Logic)

Implement a clean, testable, and decoupled layered architecture inspired by Clean Architecture principles:

1. **Route Handler / Controller Layer** (`app/api/*/route.ts` or Server Actions)

   - Thin entry point only.
   - Handle HTTP concerns: request parsing, input validation (Zod), authentication/authorization, error formatting, response status codes.
   - Immediately delegate to a Service/Use Case.
   - Do **not** put business logic or direct DB calls here.

2. **Service / Application Layer** (`services/*/`)

   - Contains business logic and use cases.
   - Orchestrates repositories, applies domain rules, handles transactions.
   - Pure TypeScript — no Next.js or HTTP-specific code.
   - Injectable dependencies (via interfaces) for testability.
   - Example: `UserService.createUser()`, `UserService.updateProfile()`.

3. **Repository Layer** (`repositories/`)

   - Abstracts data persistence (database, external APIs).
   - Define interfaces first (e.g., `IUserRepository` with methods like `findById`, `create`).
   - Provide concrete implementations (e.g., `MongooseUserRepository`).
   - Allows easy swapping (e.g., switch from Mongoose to Drizzle or anything) or mocking in tests.

4. **Domain / Entity Layer** (`domain/`)

   - Pure business models and rules (e.g., `User` entity with methods like `canChangeEmail()`).
   - Validation logic that belongs to the domain (independent of frameworks).
   - Shared types and Zod schemas for runtime validation.

5. **External API Services** (`services/api/`)
   - Dedicated clients for third-party or separate backend APIs.
   - Handle auth tokens, base URLs, error mapping, retries.
   - Keep them decoupled — treat external backends like any other repository.

## Example Flow: Creating a User via API

- `app/api/users/route.ts` (POST) → validates input → calls `userService.createUser(input)`
- `services/user/UserService.ts` → validates domain rules → calls `userRepository.create(userData)`
- `repositories/MongooseUserRepository.ts` → executes mongoose query
- All layers use interfaces and Zod for safety

## Coding Standards

- **Components**: Functional, small, single-responsibility. Use Tailwind classes.
- **Data Fetching**: Server Components → direct `fetch` or repository calls. Mutations → Server Actions preferred.
- **Error Handling**: Centralized in services or middleware. Use `error.js` boundaries in UI.
- **Testing**: Write unit tests for services/repositories (easy to mock). Integration tests for routes.

## API Testing & cURL Documentation

When documenting or testing API endpoints with cURL:

- **Always format JSON payloads with proper indentation** for readability:

  ```bash
  curl -X POST http://localhost:3000/api/endpoint \
    -H "Content-Type: application/json" \
    -d '{
      "key": "value",
      "nested": {
        "field": "data"
      }
    }' | jq .
  ```

- **Always format responses with `jq`** for readability and syntax highlighting (include `| jq .` at the end)

- **For verbose request/response inspection**, use the `-v` flag:

  ```bash
  curl -v -X POST http://localhost:3000/api/endpoint \
    -H "Content-Type: application/json" \
    -d '{
      "key": "value"
    }' 2>&1
  ```

- **All code examples in documentation and comments should:**
  - Use multi-line formatted JSON payloads with proper indentation
  - Include `| jq .` at the end for consistent, prettified JSON output with colors

## When Generating Code

- Always respect the layered architecture — never put business logic in route handlers or components.
- Use interfaces for repositories and services to enable dependency injection and testing.
- Include proper types, Zod validation, and JSDoc where complexity requires it.
- Suggest refactors if existing code violates layering principles.

These instructions ensure consistent, production-ready Next.js code with excellent separation of concerns as of 2025 best practices.
