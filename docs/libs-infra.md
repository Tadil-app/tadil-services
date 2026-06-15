# Infrastructure Libraries

## Overview
The `libs/infra` directory contains implementations for external concerns like database access, file storage, and third-party services.

## Responsibilities
- Implementing the repository interfaces defined in `libs/core`.
- Providing Prisma ORM setup, schema definitions, and migrations.
- Interfacing with file storage (e.g., MinIO/S3).
- Sending SMS or emails.

## Key Libraries
- `tadil-database`: Contains the `schema.prisma` with 10-state order lifecycle, history tracking, wallet balances, user addresses, and the `Chat` system for real-time messaging. Provides Prisma Client generation, migrations, and repository implementations (`PrismaUsersRepository`, `PrismaOrdersRepository`, `PrismaChatRepository`, etc.).
- `file-storage`: Service integration for uploading and retrieving images.
- `tadil-sms`: Integrations for sending SMS messages (e.g., Twilio).
- `payment-provider`: Backend implementation of the `PaymentGateway` interface (e.g., `MoyasarPaymentGateway`). It securely verifies payment amounts and statuses using server-side secrets (`MOYASAR_SECRET_KEY`) before an order can be confirmed.

## Location
`libs/infra`
