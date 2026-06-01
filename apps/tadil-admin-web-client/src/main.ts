import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import i18n from "./i18n/i18n";
import router from "./router";
import { apiClient } from "./integration";
import keycloak from "./integration/keycloak.ts";

const app = createApp(App);

app.config.globalProperties.$api = apiClient;
app.config.globalProperties.$keycloak = keycloak;

app.use(router);
app.use(i18n);

keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).then((authenticated) => {
  if (!authenticated) {
    window.location.reload();
  } else {
    app.mount("#app");
    
    // Auto refresh token
    setInterval(() => {
      keycloak.updateToken(70).catch(() => {
        console.error('Failed to refresh token');
        keycloak.login();
      });
    }, 60000);
  }
}).catch((error) => {
  console.error("Keycloak initialization failed", error);
});

declare module "vue" {
  interface ComponentCustomProperties {
    $api: typeof apiClient;
    $keycloak: typeof keycloak;
  }
}
