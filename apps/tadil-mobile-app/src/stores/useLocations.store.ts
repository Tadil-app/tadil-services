import { apiClient } from "@/integration/api";
import { DisplayBoundaryDTO, DisplayCityDTO, DisplayDistrictDTO } from "@/integration/dtos";
import { defineStore } from "pinia";
import { ref } from "vue";

const GEOCODE_URL =
  (import.meta.env.VITE_MAP_GEOCODE_URL as string | undefined) ||
  "https://nominatim.openstreetmap.org/reverse";

export interface GeocodedStreet {
  street: string;
  streetAr: string;
  streetEn: string;
  streetBn: string;
  streetHi: string;
  streetUr: string;
}

// Nominatim accept-language codes mapped to the address street fields.
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

  /** Reverse-geocodes a point in one language to a street-level label. */
  async function reverseGeocodeOne(
    lat: number,
    lng: number,
    lang: string
  ): Promise<string> {
    const url = `${GEOCODE_URL}?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=${lang}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return "";
    const data = await res.json();
    const a = data.address ?? {};
    // Prefer the most specific street-level parts, falling back to the
    // display name. Different areas populate different fields.
    const street = [a.road, a.neighbourhood, a.suburb, a.quarter]
      .filter(Boolean)
      .slice(0, 2)
      .join(", ");
    return street || data.name || data.display_name || "";
  }

  /**
   * Reverse-geocodes a point into all supported languages. Nominatim is queried
   * once per language sequentially to stay within the public ~1 req/sec limit.
   */
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
      for (const { lang, key } of GEOCODE_LANGS) {
        result[key] = await reverseGeocodeOne(lat, lng, lang);
      }
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
  };
});
