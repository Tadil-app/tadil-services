import { Preferences } from "@capacitor/preferences";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref<string>();

  async function initTheme() {
    currentTheme.value = "light";
    document.body.classList.remove("dark");
    await Preferences.set({
      key: "theme",
      value: "light",
    });
  }

  return {
    currentTheme,
    initTheme,
  };
});
