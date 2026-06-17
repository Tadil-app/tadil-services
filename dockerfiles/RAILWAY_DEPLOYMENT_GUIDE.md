# Railway Deployment Guide (V1 Cloud Setup)

This guide provides step-by-step instructions for deploying the custom infrastructure stack (PostgreSQL, MinIO, and Keycloak) and the Tadil backend API on Railway.

## Prerequisites
* A Railway account.
* The codebase pushed to a GitHub repository connected to Railway.

---

## Step 1: Deploy the Postgres Service

This service uses a custom initialization script to automatically create the `tadil` and `keycloak` databases on first boot.

1. In your Railway Dashboard, click **New Project** -> **Deploy from GitHub repo**.
2. Select the repository.
3. Before the build finishes, click **Add Variables**.
4. Add the following variables to trigger the initialization script:
   * `POSTGRES_USER` = `postgres`
   * `POSTGRES_PASSWORD` = `[Generate a strong password]`
   * `POSTGRES_DB` = `postgres`
   * `APP_DB_NAME` = `tadil`
   * `KEYCLOAK_DB_NAME` = `keycloak`
5. Go to the service **Settings** -> **Service specific**.
   * Set **Root Directory** to `/`.
   * Set **Dockerfile Path** to `dockerfiles/postgres.Dockerfile`.
6. Go to the **Data** tab and attach a Volume to `/var/lib/postgresql/data` so your data persists across deployments.
7. Wait for the build and deployment to complete.

---

## Step 2: Deploy the MinIO Service

This service uses a custom script to automatically create the `tadil` bucket on boot.

1. In the same project, click **New** -> **GitHub Repo** and select the repository again.
2. Go to **Settings** -> **Service specific**.
   * Set **Root Directory** to `/`.
   * Set **Dockerfile Path** to `dockerfiles/minio.Dockerfile`.
3. Go to the **Variables** tab and add:
   * `MINIO_ROOT_USER` = `[Your Admin Username, e.g., admin]`
   * `MINIO_ROOT_PASSWORD` = `[Your Admin Password]`
   * `MINIO_BUCKET` = `tadil`
4. Go to **Settings** -> **Networking** and click **Generate Domain**. *(This public domain is required for the mobile app to download files via presigned URLs).*
5. Go to the **Data** tab and attach a Volume to `/data` so your uploads persist.

---

## Step 3: Deploy the Keycloak Service

This service is pre-built with the custom `tadil` theme and auto-imports the `tadil` realm.

1. Click **New** -> **GitHub Repo** and select the repository again.
2. Go to **Settings** -> **Service specific**.
   * Set **Root Directory** to `/`.
   * Set **Dockerfile Path** to `dockerfiles/keycloak.Dockerfile`.
3. Go to **Settings** -> **Networking** and click **Generate Domain** (e.g., `tadil-auth.up.railway.app`).
4. Go to the **Variables** tab and add:
   * `KC_DB` = `postgres`
   * `KC_DB_URL` = `jdbc:postgresql://[POSTGRES_HOST]:[POSTGRES_PORT]/keycloak` *(Get the host and port from your Postgres service's "Connect" tab. Make sure it ends in `/keycloak`)*
   * `KC_DB_USERNAME` = `postgres`
   * `KC_DB_PASSWORD` = `[The password from Step 1]`
   * `KEYCLOAK_ADMIN` = `admin`
   * `KEYCLOAK_ADMIN_PASSWORD` = `[Secure Password]`
   * `KC_HTTP_ENABLED` = `true`
   * `KC_PROXY_HEADERS` = `xforwarded`
   * `KC_HOSTNAME` = `[The domain you generated in step 3.3, e.g., tadil-auth.up.railway.app]`
   * `KC_HOSTNAME_BACKCHANNEL_DYNAMIC` = `true`
   * `KC_API_CLIENT_ID` = `tadil-api`
   * `KC_API_CLIENT_SECRET` = `[Generate a secure secret string for the API]`
   * `KC_ADMIN_UI_CLIENT_ID` = `tadil-admin-ui`
   * `KC_ADMIN_UI_CLIENT_REDIRECTION_URL` = `[The public URL of your deployed Admin UI, e.g., https://admin.tadil.com]`

---

## Step 4: Deploy the Tadil API (Backend)

1. Click **New** -> **GitHub Repo** and select the repository.
2. Ensure Railway detects the Nx/NestJS setup. You may need to set the custom start command (e.g., `npm run start-admin`).
3. Go to the **Variables** tab and link the services:
   * `TADIL_DB` = `postgresql://postgres:[PASSWORD]@[POSTGRES_HOST]:[POSTGRES_PORT]/tadil` *(Ends in `/tadil`)*
   * `MINIO_ENDPOINT` = `[The public domain from Step 2.4, WITHOUT https://]`
   * `MINIO_PORT` = `443`
   * `MINIO_USE_SSL` = `true`
   * `MINIO_ACCESS_KEY` = `[From Step 2.3]`
   * `MINIO_SECRET_KEY` = `[From Step 2.3]`
   * `MINIO_BUCKET` = `tadil`
   * `KEYCLOAK_INTROSPECTION_URL` = `https://[Keycloak Domain]/realms/tadil/protocol/openid-connect/token/introspect`
   * `KEYCLOAK_CLIENT_ID` = `tadil-api` *(Must match `KC_API_CLIENT_ID` from Step 3)*
   * `KEYCLOAK_CLIENT_SECRET` = `[Must match KC_API_CLIENT_SECRET from Step 3]`

---

## Verification

Once all services show "Success" in Railway:
1. Open your Keycloak public URL; you should see the custom `tadil` login theme.
2. Log into the Keycloak Admin Console. You should see the `tadil` realm is automatically created.
3. Test a file upload via your API; it should successfully save to the `tadil` bucket in MinIO.