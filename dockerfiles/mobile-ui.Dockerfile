FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY ../apps/tadil-mobile-app .

ARG VITE_TADIL_MOBILE_API_URL
ENV VITE_TADIL_MOBILE_API_URL=${VITE_TADIL_MOBILE_API_URL}
RUN npm run build

FROM nginx:stable-alpine AS production

COPY ../apps/tadil-mobile-app/nginx.conf /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 81

CMD ["nginx", "-g", "daemon off;"]