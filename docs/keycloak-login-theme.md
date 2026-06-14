# Custom Keycloak Login Theme

The admin web client delegates authentication to Keycloak's hosted login page.
To brand that page (Tadil logo + indigo styling that matches the admin
dashboard) we ship a custom Keycloak **login theme** called `tadil`.

## Where it lives

```
keycloak-themes/
└── tadil/
    └── login/
        ├── theme.properties          # extends the stock "keycloak" login theme
        └── resources/
            ├── css/tadil.css         # indigo branding overrides
            └── img/logo.png          # Tadil logo shown above the form
```

`theme.properties` keeps the stock PatternFly layout (`parent=keycloak`) and
appends `css/tadil.css` last so our rules win:

```properties
parent=keycloak
import=common/keycloak
styles=css/login.css css/tadil.css
```

The logo is injected via CSS (`#kc-header-wrapper::before`), so no FreeMarker
template (`.ftl`) override is required.

## How it's wired up

`docker-compose.yml` mounts the theme into the Keycloak container and disables
theme caching so edits are visible on refresh during development:

```yaml
keycloak:
  environment:
    KC_SPI_THEME_CACHE_THEMES: "false"
    KC_SPI_THEME_CACHE_TEMPLATES: "false"
    KC_SPI_THEME_STATIC_MAX_AGE: "-1"
  volumes:
    - ./keycloak-themes/tadil:/opt/keycloak/themes/tadil
```

## Enabling the theme on your realm

The theme files are available to Keycloak once the container is (re)started, but
each realm must opt in:

1. Restart Keycloak so the volume is mounted:
   `docker compose up -d keycloak`
2. Open the admin console at `http://localhost:8080` (admin / admin).
3. Select your realm (the one referenced by `VITE_KEYCLOAK_REALM`).
4. Go to **Realm settings → Themes**.
5. Set **Login theme** to `tadil` and click **Save**.
6. Open the admin web client and trigger login — the new page should appear.

## Editing / iterating

- With caching disabled (above), edit `css/tadil.css` and just refresh the
  login page — no container restart needed for CSS/asset changes.
- To replace the logo, drop a new `logo.png` into `resources/img/` (the source
  copy lives at `apps/tadil-admin-web-client/public/logo.png`).
- Brand colors are defined as CSS variables at the top of `tadil.css`
  (`--tadil-primary` is indigo `#4f46e5`, matching the admin app).

## Production note

`KC_SPI_THEME_CACHE_*` are set to `false` for fast iteration in this dev
compose file. For production, remove those overrides (or set them back to
`true`) so themes are cached, and pin a specific Keycloak image tag instead of
`latest` to guarantee the login DOM/classes the CSS targets stay stable.
