import { createI18n } from "vue-i18n";
import { ar, en, ur, bn, hi } from "./locales";

const i18n = createI18n({
  legacy: false,
  locale: "ar",
  fallbackLocale: "en",
  messages: {
    ar,
    en,
    ur,
    bn,
    hi,
  },
});

export default i18n;
