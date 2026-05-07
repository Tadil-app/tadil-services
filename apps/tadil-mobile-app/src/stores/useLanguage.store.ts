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

export const useLanguageStore = defineStore("language", () => {
  const currentLocale = ref<Locale>({
    key: "ar",
    label: "عر",
    longLabel: "العربية",
    direction: "rtl",
  });
  const availableLocales: Locale[] = [
    { key: "ar", label: "عر", longLabel: "العربية", direction: "rtl" },
    { key: "en", label: "EN", longLabel: "English", direction: "ltr" },
    { key: "hi", label: "हि", longLabel: "हिंदी", direction: "ltr" },
    { key: "ur", label: "اردو", longLabel: "اردو", direction: "rtl" },
    { key: "bn", label: "বা", longLabel: "বাংলা", direction: "ltr" },
  ];

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
    document.documentElement.setAttribute("lang", locale.key);
    document.documentElement.setAttribute("dir", locale.direction);
  }
  return {
    currentLocale,
    availableLocales,
    initLanguage,
    changeLocale,
  };
});
