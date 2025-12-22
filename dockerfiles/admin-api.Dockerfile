FROM node:25-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY libs/infra/tadil-database/package.json libs/infra/tadil-database/
RUN cd libs/infra/tadil-database && npm install --legacy-peer-deps

COPY libs/infra/file-storage/package.json libs/infra/file-storage/
RUN cd libs/infra/file-storage && npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate --schema=./libs/infra/tadil-database/prisma/schema.prisma
RUN npx nx build tadil-api --prod


FROM node:25-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --omit=dev

COPY --from=builder /app/dist/apps/tadil-api ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma


ENV NODE_ENV=production
ENV PORT=4444
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

EXPOSE 4444

CMD ["node", "dist/main.js"]

