import i18n from "@/i18n/i18n";
import { Preferences } from "@capacitor/preferences";
import { defineStore } from "pinia";
import { ref } from "vue";

type Locale = {
  key: "ar" | "en" | "ur" | "bn" | "hi";
  label: "عر" | "EN" | "اردو" | "বা" | "हि";
  longLabel: "English" | "العربية" | "اردو" | "বাংলা" | "हिंदी";
  direction: "ltr" | "rtl";
};

const availableLocales: Locale[] = [
  { key: "ar", label: "عر", longLabel: "العربية", direction: "rtl" },
  { key: "en", label: "EN", longLabel: "English", direction: "ltr" },
  { key: "hi", label: "हि", longLabel: "हिंदी", direction: "ltr" },
  { key: "ur", label: "اردو", longLabel: "اردو", direction: "rtl" },
  { key: "bn", label: "বা", longLabel: "বাংলা", direction: "ltr" },
];

function readCachedLocale(): Locale {
  try {
    const key = localStorage.getItem("locale");
    return availableLocales.find((locale) => locale.key === key) || availableLocales[0];
  } catch {
    return availableLocales[0];
  }
}

export const useLanguageStore = defineStore("language", () => {
  const currentLocale = ref<Locale>(readCachedLocale());

  async function initLanguage() {
    const { value } = await Preferences.get({ key: "locale" });
    const found =
      availableLocales.find((l) => l.key === value) || availableLocales[0];
    currentLocale.value = found;
    i18n.global.locale.value = found.key;

    applyDomAttributes(found);
  }

  async function changeLocale(newLocale: Locale) {
    currentLocale.value = newLocale;
    i18n.global.locale.value = newLocale.key;

    applyDomAttributes(newLocale);
    await Preferences.set({ key: "locale", value: newLocale.key });
  }
  function applyDomAttributes(locale: Locale) {
    // Set the property, not only the attribute: iOS WebKit ignores a late
    // setAttribute when deciding text direction inside flex and shadow DOM.
    document.documentElement.lang = locale.key;
    document.documentElement.dir = locale.direction;
    if (document.body) document.body.dir = locale.direction;
    document.querySelector("ion-app")?.setAttribute("dir", locale.direction);
    try {
      localStorage.setItem("locale", locale.key);
    } catch {
      /* storage can be unavailable in private contexts */
    }
  }
  applyDomAttributes(currentLocale.value);

  return {
    currentLocale,
    availableLocales,
    initLanguage,
    changeLocale,
    applyDomAttributes,
  };
});
