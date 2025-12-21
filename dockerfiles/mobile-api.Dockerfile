FROM node:25-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY libs/infra/tadil-database/package.json libs/infra/tadil-database/
RUN cd libs/infra/tadil-database && npm install --legacy-peer-deps

COPY libs/infra/file-storage/package.json libs/infra/file-storage/
RUN cd libs/infra/file-storage && npm install --legacy-peer-deps

COPY . .

RUN npm run db-generate
RUN npx nx build tadil-mobile-api --prod

ENV NODE_ENV=production
ENV PORT=4445
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

EXPOSE 4445

CMD ["node", "dist/apps/tadil-mobile-api/main.js"]

