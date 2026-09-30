FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY . /usr/share/nginx/html

ENV PORT=8080
