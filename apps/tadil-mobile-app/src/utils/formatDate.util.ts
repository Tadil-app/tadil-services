import { useLanguageStore } from "@/stores/useLanguage.store";

export function formatDate(date: Date | string): string {
  const newDate = new Date(date);
  const { currentLocale } = useLanguageStore();
  return newDate.toLocaleDateString(currentLocale.key, {
    day: "numeric",
    month: "2-digit",
    year: "numeric",
  });
}
