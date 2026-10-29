# Standalone build for Tadil Mobile App (Bypassing Nx)
FROM node:22-alpine AS build

# Set working directory to the app folder inside the container
WORKDIR /app

# Copy the specific app's package file
COPY apps/tadil-mobile-app/package.json ./

# Install dependencies
RUN npm install

# Copy the app's source code
COPY apps/tadil-mobile-app/ .

# Inject environment variables. Vite inlines VITE_* at build time, so these
# must be present on the Railway service before the image is built.
ARG VITE_TADIL_MOBILE_API_URL
ENV VITE_TADIL_MOBILE_API_URL=${VITE_TADIL_MOBILE_API_URL}
ARG VITE_MOYASAR_PUBLISHABLE_KEY
ENV VITE_MOYASAR_PUBLISHABLE_KEY=${VITE_MOYASAR_PUBLISHABLE_KEY}

# Run the local build script
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production
COPY apps/tadil-mobile-app/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
