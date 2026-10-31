FROM postgres:17-alpine

USER root
RUN apk add --no-cache rclone ca-certificates
COPY backup.sh /usr/local/bin/backup.sh
RUN chmod 755 /usr/local/bin/backup.sh

USER postgres
ENV HOME=/tmp
ENTRYPOINT ["/usr/local/bin/backup.sh"]
