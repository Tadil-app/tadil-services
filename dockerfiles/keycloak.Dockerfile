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

# Switch to root to write the script and ensure file permissions match
USER root

# Write the startup script using a clean heredoc
RUN cat << 'EOF' > /opt/keycloak/bin/startup.sh
#!/bin/bash
sed -i "s|\${env.KC_ADMIN_UI_CLIENT_ID}|${KC_ADMIN_UI_CLIENT_ID}|g" /opt/keycloak/data/import/tadil-realm-init.json
sed -i "s|\${env.KC_ADMIN_UI_CLIENT_REDIRECTION_URL}|${KC_ADMIN_UI_CLIENT_REDIRECTION_URL}|g" /opt/keycloak/data/import/tadil-realm-init.json
exec /opt/keycloak/bin/kc.sh start --optimized --import-realm
EOF

# Give executable rights and transfer ownership back to the non-root user
RUN chmod +x /opt/keycloak/bin/startup.sh && \
    chown -R 1000:0 /opt/keycloak/bin/startup.sh /opt/keycloak/data/import/

# Revert back to Keycloak's standard non-root user
USER 1000

ENTRYPOINT ["/opt/keycloak/bin/startup.sh"]
