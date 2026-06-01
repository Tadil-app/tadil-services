# Admin Authentication & RBAC (Keycloak)

## Overview
The Tadil platform uses [Keycloak](https://www.keycloak.org/) for Authentication and Role-Based Access Control (RBAC) exclusively for the Admin Dashboard and the Admin API. This provides a robust, secure, and enterprise-grade identity management solution, replacing the need for a custom email/password implementation.

## Infrastructure
Keycloak runs in its own dedicated Docker container alongside a dedicated PostgreSQL database container (`tadil-keycloak-db`). This ensures strict data isolation from the main application database and allows Keycloak to be scaled or backed up independently.

## Backend Integration (`tadil-api`)
The NestJS backend acts as a **Resource Server**.
- **Token Introspection:** Instead of relying on deprecated wrappers, the backend uses the standard Keycloak REST API Token Introspection (`/protocol/openid-connect/token/introspect`) to validate JWTs on every request.
- **Secure by Default:** The `KeycloakAuthGuard` and `RolesGuard` are registered globally (`APP_GUARD`) in the `AppModule`. Every endpoint is protected by default.
- **Public Endpoints:** Endpoints that require public access (e.g., fetching images via `GET /files/:id`) are explicitly opted-out using the `@Public()` decorator.
- **Role Enforcement:** By default, all protected endpoints strictly require the `super_admin` role unless overridden.

## Frontend Integration (`tadil-admin-web-client`)
The Vue 3 dashboard integrates directly with Keycloak using the official `keycloak-js` adapter.
- **OIDC Flow:** The application initializes the Keycloak client before mounting the Vue instance. Unauthenticated users are automatically redirected to the Keycloak login screen.
- **Token Management:** The access token is automatically refreshed every 60 seconds in the background.
- **API Interceptor:** An Axios request interceptor automatically attaches the `Bearer <token>` to the `Authorization` header of all outgoing requests to the Admin API.
- **Audience Mapping:** The Keycloak frontend client (`tadil-admin-ui`) is configured with an "Audience Protocol Mapper". This ensures that the generated tokens include the `tadil-api` audience, allowing the backend to successfully introspect and validate them.

## Administrator Management
Super Admins manage other administrators directly via the Keycloak Admin Console.
- **Restricted Access:** To prevent accidental configuration changes, non-technical administrators are assigned a restricted role (e.g., `manage-users` from the `realm-management` client). 
- This limits their UI to only user and role management, hiding all complex realm, client, and identity provider configurations.
- They can add users, set initial passwords, and assign the `super_admin` role safely.

## Production Deployment (Railway / PaaS)
When deploying Keycloak to a PaaS provider like Railway, specific environment configurations are required to ensure Keycloak operates correctly behind the provider's reverse proxy:

1. **Reverse Proxy Configuration:**
   Because the PaaS handles SSL termination, Keycloak must be configured to trust the proxy headers and allow HTTP internally:
   - `KC_PROXY_HEADERS=xforwarded`
   - `KC_HTTP_ENABLED=true`
   - `KC_HOSTNAME_STRICT=false` (Set this to `false` temporarily, or configure `KC_HOSTNAME` to your specific custom domain).

2. **Database Connection String (JDBC):**
   Keycloak requires a specifically formatted JDBC URL, not a standard Postgres URL. Ensure you use the following format:
   - `KC_DB=postgres`
   - `KC_DB_URL=jdbc:postgresql://<db-host>:<port>/<database-name>` (Do not use `postgres://`).

3. **Database Creation:**
   Unlike local Docker setups, managed databases often do not auto-create secondary databases. You must either:
   - Manually execute `CREATE DATABASE keycloak;` on your managed PostgreSQL instance.
   - Point the `KC_DB_URL` to the default database provided by your PaaS (e.g., `railway`). If sharing the database with the main app, it is recommended to set `KC_DB_SCHEMA=keycloak` to isolate tables.

## Location
- Guard implementations: `apps/tadil-api/src/app/auth/guards/`
- Frontend setup: `apps/tadil-admin-web-client/src/keycloak.ts` & `main.ts`
