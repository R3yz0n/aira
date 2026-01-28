# GitHub Copilot Custom Instructions for Next.js Applications

Performance & Response Constraints (CRITICAL)

Optimize for speed first, give 5x quick response. Prefer the shortest correct solution.

Be concise: no essays, no tutorials, no repetition be very short while answering or reponding.

Default to bullet points or code-only responses.

Do not explain obvious steps unless explicitly asked.

Skip theory, background, and justifications.

Output only what is necessary to implement the solution.

Assume senior-level Next.js & TypeScript knowledge.

Never restate the prompt or architecture rules.

Prefer direct code diffs or final implementations.

If multiple options exist, pick the best one and proceed (no comparisons).

No emojis, no fluff, no motivational text.
This repository is a modern Next.js (version 15+) application using the **App Router**. Follow these instructions strictly to ensure high-quality, maintainable, scalable, and performant code.

## Project Overview

- Language: TypeScript (strict mode enabled)
- UI Components: Prefer shadcn/ui, Radix UI primitives, or similar accessible components
- Architecture Goals: Modular, well-documented, decoupled, and following clean system design principles
- Data Fetching: Prefer Server Components and Server Actions; minimize client-side fetching
- API: If internal Route Handlers are used (`app/api/`), keep them thin and decoupled. Prefer external decoupled backend APIs via service layer for better separation.

## Core Principles

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

- **Always format responses with `jq`** for readability and syntax highlighting (include `| jq .` at the end)

## When Generating Code

- Always respect the layered architecture — never put business logic in route handlers or components.
- Use interfaces for repositories and services to enable dependency injection and testing.
- Include proper types, Zod validation, and JSDoc where complexity requires it.
- Suggest refactors if existing code violates layering principles.

These instructions ensure consistent, production-ready Next.js code with excellent separation of concerns as of 2025 best practices.
