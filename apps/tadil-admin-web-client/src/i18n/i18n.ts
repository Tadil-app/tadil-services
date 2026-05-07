import { createI18n } from "vue-i18n";
import { en, ar} from "./locales";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("locale") || "ar",
  fallbackLocale: "en",
  messages: {
    en: en,
    ar: ar
  },
});

export default i18n;
