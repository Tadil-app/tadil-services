import { apiClient } from "@/integration/api";
import { DisplayCityDTO, DisplayDistrictDTO } from "@/integration/dtos";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useLocationsStore = defineStore("locations", () => {
  const cities = ref<DisplayCityDTO[]>([]);
  const districtsByCity = ref<Record<number, DisplayDistrictDTO[]>>({});
  const loadingCities = ref(false);
  const loadingDistricts = ref(false);

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

  return {
    cities,
    districtsByCity,
    loadingCities,
    loadingDistricts,
    searchCities,
    fetchDistricts,
  };
});
