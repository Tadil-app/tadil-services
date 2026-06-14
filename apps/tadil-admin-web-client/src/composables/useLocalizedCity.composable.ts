import { useI18n } from "vue-i18n";

// Addresses store city/district in all 5 supported languages. Pick the field
// for the admin's current language, falling back to English (then Arabic) for
// any locale whose value is missing.
type CityNames = {
  cityNameAr?: string;
  cityNameEn?: string;
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

export function useLocalizedCityComposable() {
  const { locale } = useI18n();

  const cityLabel = (a?: CityNames | null) => {
    const byLocale: Record<string, string | undefined> = {
      ar: a?.cityNameAr,
      en: a?.cityNameEn,
      bn: a?.cityNameBn,
      hi: a?.cityNameHi,
      ur: a?.cityNameUr,
    };
    return byLocale[locale.value] || a?.cityNameEn || a?.cityNameAr || "";
  };

  const districtLabel = (a?: DistrictNames | null) => {
    const byLocale: Record<string, string | undefined> = {
      ar: a?.districtNameAr,
      en: a?.districtNameEn,
      bn: a?.districtNameBn,
      hi: a?.districtNameHi,
      ur: a?.districtNameUr,
    };
    return byLocale[locale.value] || a?.districtNameEn || a?.districtNameAr || "";
  };

  const streetLabel = (a?: StreetNames | null) => {
    const byLocale: Record<string, string | undefined> = {
      ar: a?.streetAr,
      en: a?.streetEn,
      bn: a?.streetBn,
      hi: a?.streetHi,
      ur: a?.streetUr,
    };
    return (
      byLocale[locale.value] ||
      a?.streetEn ||
      a?.streetAr ||
      a?.street ||
      ""
    );
  };

  return { cityLabel, districtLabel, streetLabel };
}
