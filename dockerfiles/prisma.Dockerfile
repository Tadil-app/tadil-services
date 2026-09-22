FROM node:25-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY libs/infra/tadil-database/package.json .
RUN npm install --legacy-peer-deps

COPY libs/infra/tadil-database/prisma ./libs/infra/tadil-database/prisma
COPY apps/tadil-api/src/app/auth/permissions.ts ./apps/tadil-api/src/app/auth/permissions.ts

ENV NODE_OPTIONS="--dns-result-order=ipv4first"

CMD ["sh", "-c", "sleep 5 && npx prisma generate --schema=./libs/infra/tadil-database/prisma/schema.prisma && npx prisma migrate deploy --schema=./libs/infra/tadil-database/prisma/schema.prisma && npx tsx ./libs/infra/tadil-database/prisma/seed.ts && if [ -n \"${STAFF_BOOTSTRAP_EMAIL}${STAFF_BOOTSTRAP_NAME}${STAFF_BOOTSTRAP_PASSWORD}\" ]; then npx tsx ./libs/infra/tadil-database/prisma/bootstrap-staff.ts; fi"]
