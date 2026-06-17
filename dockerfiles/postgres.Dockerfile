FROM postgres:latest

# Copy the initialization script into the container's init directory
COPY dockerfiles/postgres-init.sh /docker-entrypoint-initdb.d/postgres-init.sh

# Ensure the script is executable
RUN chmod +x /docker-entrypoint-initdb.d/postgres-init.sh