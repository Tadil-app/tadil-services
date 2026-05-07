import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { IonicVue, iosTransitionAnimation } from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */
/* import '@ionic/vue/css/palettes/dark.always.css'; */
/* import '@ionic/vue/css/palettes/dark.system.css'; */
import "@ionic/vue/css/palettes/dark.class.css";

/* Theme variables */
import "./theme/variables.css";
/* Tailwind CSS */
import "./theme/tailwind.css";
import i18n from "./i18n/i18n";

import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { createPinia } from "pinia";
import { useAuthStore, useCartStore, useThemeStore } from "./stores";
import { useLanguageStore } from "./stores/useLanguage.store";
defineCustomElements(window);

const app = createApp(App);
const pinia = createPinia();

app.use(IonicVue, {
  mode: "ios",
  navAnimation: iosTransitionAnimation,
  rippleEffect: false,
});
app.use(i18n);
app.use(router);

app.use(pinia);

const authStore = useAuthStore();
authStore.initAuth();

const languageStore = useLanguageStore();
languageStore.initLanguage();

const themeStore = useThemeStore();
themeStore.initTheme();

const cartStore = useCartStore();
cartStore.loadCart();

router.isReady().then(() => {
  app.mount("#app");
});
