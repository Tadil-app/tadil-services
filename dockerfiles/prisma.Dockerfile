FROM node:25-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY libs/infra/tadil-database/package.json .
RUN npm install --legacy-peer-deps

COPY libs/infra/tadil-database/prisma ./libs/infra/tadil-database/prisma

ENV NODE_OPTIONS="--dns-result-order=ipv4first"

CMD ["sh", "-c", "sleep 5 && npx prisma migrate deploy --schema=./libs/infra/tadil-database/prisma/schema.prisma"]