import { ref } from "vue";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const theme = ref<Theme>(getInitialTheme());

function apply(value: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", value === "dark");
  root.style.colorScheme = value;
}

export function useTheme() {
  function setTheme(value: Theme) {
    theme.value = value;
    localStorage.setItem(STORAGE_KEY, value);
    apply(value);
  }

  function toggleTheme() {
    setTheme(theme.value === "dark" ? "light" : "dark");
  }

  return { theme, setTheme, toggleTheme };
}

// Apply once on module load so there is no flash before the toggle mounts.
apply(theme.value);
