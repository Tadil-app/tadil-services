# Multi-stage build for Tadil Mobile App
FROM node:22-alpine AS build

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig.base.json ./
COPY nx.json ./

# Install dependencies
RUN npm ci

# Copy all source
COPY . .

# Build the specific app
ARG VITE_TADIL_MOBILE_API_URL
ENV VITE_TADIL_MOBILE_API_URL=${VITE_TADIL_MOBILE_API_URL}

# Run build via Nx
RUN npx nx build tadil-mobile-app --prod

# Production stage
FROM nginx:stable-alpine AS production

# Copy custom nginx config
COPY apps/tadil-mobile-app/nginx.conf /etc/nginx/templates/default.conf.template

# Copy built assets
COPY --from=build /app/apps/tadil-mobile-app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
