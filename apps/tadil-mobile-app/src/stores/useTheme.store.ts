import { Preferences } from "@capacitor/preferences";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref<string>();

  async function initTheme() {
    const { value } = await Preferences.get({ key: "theme" });
    currentTheme.value = value || "light";
    document.body.classList.toggle("dark", currentTheme.value === "dark");
  }

  async function toggleTheme() {
    currentTheme.value = currentTheme.value === "dark" ? "light" : "dark";
    document.body.classList.toggle("dark", currentTheme.value === "dark");
    await Preferences.set({
      key: "theme",
      value: currentTheme.value,
    });
  }

  return {
    currentTheme,
    initTheme,
    toggleTheme,
  };
});
