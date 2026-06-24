#!/bin/bash
set -e

# This script runs automatically ONLY on the very first boot of the Postgres container.
# It uses the default superuser credentials ($POSTGRES_USER) to create the additional databases.

# Function to create a database if it doesn't exist
create_database() {
    local db_name=$1
    if [ -n "$db_name" ]; then
        echo "Creating database '$db_name'..."
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
            SELECT 'CREATE DATABASE "$db_name"'
            WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$db_name')\gexec
EOSQL
        echo "Database '$db_name' created successfully!"
    fi
}

# Create databases from environment variables
create_database "$APP_DB_NAME"
create_database "$KEYCLOAK_DB_NAME"

echo "Custom initialization complete."