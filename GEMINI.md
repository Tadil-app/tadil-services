# GEMINI.md - TadilServices

This workspace is an **Nx Monorepo** containing the backend services for **Tadil**, an alteration service platform. It follows **Clean Architecture** principles, separating business logic from infrastructure.

## Project Overview

- **Main Applications:**
  - `apps/tadil-api`: Admin API for managing alterations, models, orders, and users.
  - `apps/tadil-mobile-api`: Mobile API for customers, tailors, and couriers.
- **Core Libraries (`libs/core`):**
  - Contains domain logic organized into use cases, models, and repository interfaces (e.g., `tadil-alterations`, `tadil-users`).
- **Infrastructure Libraries (`libs/infra`):**
  - `tadil-database`: Prisma client, migrations, and repository implementations.
  - `file-storage`: Service for handling file uploads/storage.

### Key Technologies

- **Framework:** [NestJS](https://nestjs.com/)
- **Monorepo Tool:** [Nx](https://nx.dev/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **API Documentation:** [Swagger](https://swagger.io/) (Available at `/api` on running apps)
- **Testing:** [Jest](https://jestjs.io/)
- **Compiler:** [SWC](https://swc.rs/)

---

## Building and Running

### Prerequisites

- Node.js (v20+ recommended)
- Docker (for PostgreSQL via `docker-compose.yml`)
- Environment variables configured (see `sample.env`)

### Database Setup

Before running the apps, ensure the database is ready:

```bash
# Generate Prisma Client
npm run db-generate

# Run migrations (dev)
npm run db-migrate-dev

# Seed database
npm run db-seed
```

### Development Commands

```bash
# Start Admin API
npm run start-admin

# Start Mobile API
npm run start-mobile

# Run Tests
npm run test
```

### Production Build

```bash
# Build Admin API
npm run build-admin

# Build Mobile API
npm run build-mobile
```

---

## Development Conventions

- **Architecture:** Follow Clean Architecture. Put domain logic in `libs/core` as use cases. Use the repository pattern to abstract database access.
- **Dependency Rule:** `apps` can depend on `libs`, and `libs/core` should not depend on `libs/infra` (inverted through interfaces).
- **Naming:**
  - Use cases: `Create[Entity]UseCase.ts`
  - Controllers: Standard NestJS controllers in `apps`.
  - Modules: Group related logic into NestJS modules.
- **Documentation:** Use `@nestjs/swagger` decorators on DTOs and Controllers for up-to-date documentation.
- **Formatting & Linting:**
  - Prettier for formatting (`.prettierrc`).
  - ESLint for linting (`eslint.config.mjs`).
  - Run `nx lint` to check for issues.
- **Testing:** Write unit tests for use cases and integration tests for repositories where applicable. Run `nx test <project-name>` to execute tests.

---

## Workspace Structure Highlights

- `apps/`: Application entry points and NestJS modules/controllers.
- `libs/core/`: Domain entities and business use cases.
- `libs/infra/`: Data persistence (Prisma) and external service integrations.
- `docker-compose.yml`: Local infrastructure (PostgreSQL).
