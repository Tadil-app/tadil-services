# Standalone build for Tadil Admin Web Client (Bypassing Nx)
FROM node:22-alpine AS build

# Set working directory to the app folder inside the container
WORKDIR /app

# Copy the specific app's package files (lockfile keeps Vite/Rollup reproducible)
COPY apps/tadil-admin-web-client/package.json apps/tadil-admin-web-client/package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the app's source code
COPY apps/tadil-admin-web-client/ .

# Inject environment variables
ARG VITE_TADIL_API_URL
ENV VITE_TADIL_API_URL=${VITE_TADIL_API_URL}

# Run the local build script. Rollup is pinned via package.json overrides
# (4.52.5): newer Rollup AST walkers hit Alpine's 8MB stack and fail with
# "Code is nested too deeply" during Vite production builds.
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production
ENV NGINX_ENVSUBST_FILTER="^(PORT|TADIL_API_UPSTREAM)$"
COPY apps/tadil-admin-web-client/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
