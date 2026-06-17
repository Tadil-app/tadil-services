FROM quay.io/keycloak/keycloak:latest AS builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Configure database vendor
ENV KC_DB=postgres

WORKDIR /opt/keycloak

# Copy custom theme
COPY keycloak-config/themes/tadil /opt/keycloak/themes/tadil

# Build optimized Keycloak distribution
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:latest
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Copy realm configuration for automatic import
COPY keycloak-config/tadil-realm-init.json /opt/keycloak/data/import/

# Create a small startup script to swap env vars using native bash manipulation
RUN echo '#!/bin/bash \n\
sed -i "s|\${env.KC_ADMIN_UI_CLIENT_ID}|${KC_ADMIN_UI_CLIENT_ID}|g" /opt/keycloak/data/import/tadil-realm-init.json \n\
sed -i "s|\${env.KC_ADMIN_UI_CLIENT_REDIRECTION_URL}|${KC_ADMIN_UI_CLIENT_REDIRECTION_URL}|g" /opt/keycloak/data/import/tadil-realm-init.json \n\
exec /opt/keycloak/bin/kc.sh start --optimized --import-realm' > /opt/keycloak/bin/startup.sh && chmod +x /opt/keycloak/bin/startup.sh

# The runtime environment variables (KC_DB_URL, KC_DB_USERNAME, KC_DB_PASSWORD, 
# KEYCLOAK_ADMIN, KEYCLOAK_ADMIN_PASSWORD, etc.) should be provided by the environment.

# Start Keycloak and import the realm
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--optimized", "--import-realm"]
