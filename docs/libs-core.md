# Core Libraries

## Overview
The `libs/core` directory contains the domain logic and business rules for the Tadil platform. It follows Clean Architecture principles.

## Structure
Core libraries are independent of any specific framework (like NestJS) or infrastructure (like Prisma). They contain:
- **Models**: Interfaces describing the domain entities.
- **Repositories**: Interfaces defining the contracts for data access.
- **Use Cases**: Classes containing the specific business logic for different actions (e.g., `LoginUseCase`, `CreateOrderUseCase`).

## Key Libraries
- `tadil-auth`: Authentication and authorization logic (login, token validation, approvals).
- `tadil-users`: User management logic.
- `tadil-alterations`: Logic for managing alteration definitions.
- `tadil-models`: Logic for predefined clothing models.
- `tadil-orders`: Core order processing workflow.
- `tadil-common`: Shared exceptions, utilities, and common models.

## Location
`libs/core`
