# Infrastructure Libraries

## Overview
The `libs/infra` directory contains implementations for external concerns like database access, file storage, and third-party services.

## Responsibilities
- Implementing the repository interfaces defined in `libs/core`.
- Providing Prisma ORM setup, schema definitions, and migrations.
- Interfacing with file storage (e.g., MinIO/S3).
- Sending SMS or emails.

## Key Libraries
- `tadil-database`: Contains the `schema.prisma`, Prisma Client generation, migrations, and repository implementations (`PrismaUsersRepository`, etc.).
- `file-storage`: Service integration for uploading and retrieving images.
- `tadil-sms`: Integrations for sending SMS messages (e.g., Twilio).

## Location
`libs/infra`
