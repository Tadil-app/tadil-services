import { useI18n } from "vue-i18n";

// Addresses store city/district in Arabic and English. Pick the field for the
// admin's current language, falling back to English (then Arabic) for locales
// without a dedicated name.
export function useLocalizedCityComposable() {
  const { locale } = useI18n();

  const cityLabel = (
    a?: { cityNameAr?: string; cityNameEn?: string } | null
  ) =>
    (locale.value === "ar" ? a?.cityNameAr : a?.cityNameEn) ||
    a?.cityNameEn ||
    a?.cityNameAr ||
    "";

  const districtLabel = (
    a?: { districtNameAr?: string; districtNameEn?: string } | null
  ) =>
    (locale.value === "ar" ? a?.districtNameAr : a?.districtNameEn) ||
    a?.districtNameEn ||
    a?.districtNameAr ||
    "";

  return { cityLabel, districtLabel };
}
