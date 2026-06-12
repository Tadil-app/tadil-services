import { useLanguageStore } from "@/stores";

// Addresses store city/district names in all 5 supported languages. Pick the
// field for the viewer's current language, falling back to English then Arabic
// for any locale whose value is missing.
type CityNames = {
  cityNameAr: string;
  cityNameEn: string;
  cityNameBn?: string;
  cityNameHi?: string;
  cityNameUr?: string;
};

type DistrictNames = {
  districtNameAr?: string;
  districtNameEn?: string;
  districtNameBn?: string;
  districtNameHi?: string;
  districtNameUr?: string;
};

type StreetNames = {
  street?: string;
  streetAr?: string;
  streetEn?: string;
  streetBn?: string;
  streetHi?: string;
  streetUr?: string;
};

export function useLocalizedAddress() {
  const languageStore = useLanguageStore();

  const cityName = (a?: CityNames | null) => {
    if (!a) return "";
    const byLocale: Record<string, string | undefined> = {
      ar: a.cityNameAr,
      en: a.cityNameEn,
      bn: a.cityNameBn,
      hi: a.cityNameHi,
      ur: a.cityNameUr,
    };
    return byLocale[languageStore.currentLocale.key] || a.cityNameEn || a.cityNameAr || "";
  };

  const districtName = (a?: DistrictNames | null) => {
    if (!a) return "";
    const byLocale: Record<string, string | undefined> = {
      ar: a.districtNameAr,
      en: a.districtNameEn,
      bn: a.districtNameBn,
      hi: a.districtNameHi,
      ur: a.districtNameUr,
    };
    return (
      byLocale[languageStore.currentLocale.key] ||
      a.districtNameEn ||
      a.districtNameAr ||
      ""
    );
  };

  const streetName = (a?: StreetNames | null) => {
    if (!a) return "";
    const byLocale: Record<string, string | undefined> = {
      ar: a.streetAr,
      en: a.streetEn,
      bn: a.streetBn,
      hi: a.streetHi,
      ur: a.streetUr,
    };
    return (
      byLocale[languageStore.currentLocale.key] ||
      a.streetEn ||
      a.streetAr ||
      a.street ||
      ""
    );
  };

  return { cityName, districtName, streetName };
}
