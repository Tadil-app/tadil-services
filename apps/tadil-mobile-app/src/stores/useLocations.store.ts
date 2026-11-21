import { apiClient } from "@/integration/api";
import { DisplayBoundaryDTO, DisplayCityDTO, DisplayDistrictDTO } from "@/integration/dtos";
import { loadGoogleMaps } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface GeocodedStreet {
  street: string;
  streetAr: string;
  streetEn: string;
  streetBn: string;
  streetHi: string;
  streetUr: string;
}

// Geocoder language codes mapped to the address street fields.
const GEOCODE_LANGS: { lang: string; key: keyof GeocodedStreet }[] = [
  { lang: "ar", key: "streetAr" },
  { lang: "en", key: "streetEn" },
  { lang: "bn", key: "streetBn" },
  { lang: "hi", key: "streetHi" },
  { lang: "ur", key: "streetUr" },
];

export const useLocationsStore = defineStore("locations", () => {
  const cities = ref<DisplayCityDTO[]>([]);
  const districtsByCity = ref<Record<number, DisplayDistrictDTO[]>>({});
  const loadingCities = ref(false);
  const loadingDistricts = ref(false);
  // Boundary geometries are large-ish, so cache them once fetched.
  const districtBoundaries = ref<Record<string, DisplayBoundaryDTO | null>>({});
  const cityBoundaries = ref<Record<number, DisplayBoundaryDTO | null>>({});

  async function searchCities(term: string) {
    loadingCities.value = true;
    try {
      const { data } = await apiClient.locationsControllerGetCities(
        term.trim() ? { search: term.trim() } : undefined
      );
      cities.value = data;
    } catch (error) {
      console.error("Failed to fetch cities", error);
    } finally {
      loadingCities.value = false;
    }
  }

  async function fetchDistricts(cityId: number) {
    if (districtsByCity.value[cityId]) return districtsByCity.value[cityId];
    loadingDistricts.value = true;
    try {
      const { data } = await apiClient.locationsControllerGetDistricts(cityId);
      districtsByCity.value[cityId] = data;
      return data;
    } catch (error) {
      console.error("Failed to fetch districts", error);
      return [];
    } finally {
      loadingDistricts.value = false;
    }
  }

  async function fetchDistrictBoundary(districtId: string) {
    if (districtId in districtBoundaries.value)
      return districtBoundaries.value[districtId];
    try {
      const { data } =
        await apiClient.locationsControllerGetDistrictBoundary(districtId);
      districtBoundaries.value[districtId] = data ?? null;
      return data ?? null;
    } catch (error) {
      console.error("Failed to fetch district boundary", error);
      return null;
    }
  }

  async function fetchCityBoundary(cityId: number) {
    if (cityId in cityBoundaries.value) return cityBoundaries.value[cityId];
    try {
      const { data } =
        await apiClient.locationsControllerGetCityBoundary(cityId);
      cityBoundaries.value[cityId] = data ?? null;
      return data ?? null;
    } catch (error) {
      console.error("Failed to fetch city boundary", error);
      return null;
    }
  }

  /**
   * Reverse-geocodes a point in one language to "Street, Neighbourhood".
   * Uses the JS Geocoder (not the REST API) because the REST API rejects
   * browser keys restricted by referrer.
   */
  async function reverseGeocodeOne(
    lat: number,
    lng: number,
    lang: string
  ): Promise<string> {
    await loadGoogleMaps(lang);
    const { Geocoder } = (await google.maps.importLibrary(
      "geocoding"
    )) as google.maps.GeocodingLibrary;
    const { results } = await new Geocoder().geocode({
      location: { lat, lng },
      language: lang,
    });
    // Results go from most to least specific; take the first street and the
    // first neighbourhood found across them.
    const find = (...types: string[]) =>
      results
        .flatMap((r) => r.address_components)
        .find((c) => types.some((t) => c.types.includes(t)))?.long_name;
    const street = find("route");
    const area = find("neighborhood", "sublocality_level_1", "sublocality");
    return (
      [street, area].filter(Boolean).join(", ") ||
      results[0]?.formatted_address ||
      ""
    );
  }

  /** Reverse-geocodes a point into all supported languages in parallel. */
  async function reverseGeocode(
    lat: number,
    lng: number
  ): Promise<GeocodedStreet> {
    const result: GeocodedStreet = {
      street: "",
      streetAr: "",
      streetEn: "",
      streetBn: "",
      streetHi: "",
      streetUr: "",
    };
    try {
      const labels = await Promise.all(
        // One failing language (e.g. ZERO_RESULTS) must not blank the others.
        GEOCODE_LANGS.map(({ lang }) =>
          reverseGeocodeOne(lat, lng, lang).catch(() => "")
        )
      );
      GEOCODE_LANGS.forEach(({ key }, i) => (result[key] = labels[i]));
      // The legacy `street` mirrors English as the default label.
      result.street = result.streetEn || result.streetAr || "";
    } catch (error) {
      console.error("Reverse geocode failed", error);
    }
    return result;
  }

  return {
    cities,
    districtsByCity,
    loadingCities,
    loadingDistricts,
    searchCities,
    fetchDistricts,
    fetchDistrictBoundary,
    fetchCityBoundary,
    reverseGeocode,
    reverseGeocodeOne,
  };
});
