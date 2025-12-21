FROM node:25-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Only copy what is needed for migrations
COPY package.json package-lock.json* ./
COPY libs/infra/tadil-database/package.json ./libs/infra/tadil-database/
RUN npm install --legacy-peer-deps

# Copy the actual prisma schema and migrations
COPY libs/infra/tadil-database/prisma ./libs/infra/tadil-database/prisma

# Force Node to handle DNS resolution gracefully
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

# Added a 5s sleep to ensure the internal network is ready before Prisma attempts to connect
CMD ["sh", "-c", "sleep 5 && npm run prisma-migrate-deploy -w tadil-database"]