# Multi-stage build for Tadil Admin Web Client
FROM node:22-alpine AS build

WORKDIR /app

# Copy root package files for monorepo dependencies
COPY package*.json ./
COPY tsconfig.base.json ./
COPY nx.json ./

# Install all dependencies (needed for Nx and shared libs)
RUN npm ci

# Copy all source code (including libs which apps depend on)
COPY . .

# Build the specific app using Nx
ARG VITE_TADIL_API_URL
ENV VITE_TADIL_API_URL=${VITE_TADIL_API_URL}

# Run build via Nx
RUN npx nx build tadil-admin-web-client --prod

# Production stage
FROM nginx:stable-alpine AS production

# Copy custom nginx config
COPY apps/tadil-admin-web-client/nginx.conf /etc/nginx/templates/default.conf.template

# Copy built assets from build stage
# Since Vite builds into the app's local dist folder when run via Nx/npm run build
COPY --from=build /app/apps/tadil-admin-web-client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
