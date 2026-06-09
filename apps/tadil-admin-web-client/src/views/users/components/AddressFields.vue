<template>
  <div class="space-y-4 rounded-lg border p-4">
    <div>
      <h2 class="text-base font-semibold">
        {{ $t("users.address.title") }}
      </h2>
      <p class="text-sm text-muted-foreground">
        {{ $t("users.address.requiredHint") }}
      </p>
    </div>

    <div class="space-y-1.5">
      <InputLabel for="address-city">
        {{ $t("users.address.city") }}
      </InputLabel>
      <div class="relative">
        <input
          id="address-city"
          :value="citySearch"
          :placeholder="$t('users.address.searchCity')"
          class="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-0 placeholder:text-muted-foreground"
          :class="showValidation && !hasCity ? 'border-red-500' : 'border-input'"
          @focus="openCityResults"
          @input="onCityInput"
          @blur="closeCityResultsSoon"
        />
        <p
          v-if="showValidation && !hasCity"
          class="mt-1 text-xs text-red-500"
        >
          {{ $t("users.address.cityRequired") }}
        </p>
        <div
          v-if="isCityResultsOpen"
          class="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border bg-background shadow-lg"
        >
          <button
            v-for="city in cityOptions"
            :key="city.id"
            type="button"
            class="block w-full px-3 py-2 text-start text-sm hover:bg-muted"
            @click="selectCity(city)"
          >
            {{ localizedName(city) }}
          </button>
          <div
            v-if="!loadingCities && cityOptions.length === 0"
            class="px-3 py-2 text-sm text-muted-foreground"
          >
            {{ $t("users.address.noCitiesFound") }}
          </div>
          <div
            v-if="loadingCities"
            class="px-3 py-2 text-sm text-muted-foreground"
          >
            {{ $t("users.address.loading") }}
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-1.5">
      <InputLabel for="address-district">
        {{ $t("users.address.district") }}
        <span class="text-sm font-normal text-muted-foreground">
          {{ $t("users.address.optional") }}
        </span>
      </InputLabel>
      <div class="relative">
        <input
          id="address-district"
          :value="districtSearch"
          :disabled="!modelValue.cityId"
          :placeholder="$t('users.address.searchDistrict')"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-0 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          @focus="openDistrictResults"
          @input="onDistrictInput"
          @blur="closeDistrictResultsSoon"
        />
        <div
          v-if="isDistrictResultsOpen"
          class="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border bg-background shadow-lg"
        >
          <button
            v-for="district in filteredDistricts"
            :key="district.id"
            type="button"
            class="block w-full px-3 py-2 text-start text-sm hover:bg-muted"
            @click="selectDistrict(district)"
          >
            {{ localizedName(district) }}
          </button>
          <div
            v-if="!loadingDistricts && filteredDistricts.length === 0"
            class="px-3 py-2 text-sm text-muted-foreground"
          >
            {{ $t("users.address.noDistrictsFound") }}
          </div>
          <div
            v-if="loadingDistricts"
            class="px-3 py-2 text-sm text-muted-foreground"
          >
            {{ $t("users.address.loading") }}
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <InputLabel>
        {{ $t("users.address.location") }}
      </InputLabel>
      <div class="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
        <div class="min-w-0">
          <p v-if="isGeocoding" class="text-sm text-muted-foreground">
            {{ $t("users.address.locating") }}
          </p>
          <p v-else-if="modelValue.street" class="truncate text-sm">
            {{ modelValue.street }}
          </p>
          <p v-else-if="hasLocation" class="text-sm">
            {{ $t("users.address.locationSet") }}
          </p>
          <p v-else class="text-sm text-muted-foreground">
            {{ $t("users.address.pickOnMapFirst") }}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          :disabled="!canPickOnMap || loadingBoundary"
          @click="openMapPicker"
        >
          {{ loadingBoundary ? $t("users.address.loading") : $t("users.address.pickOnMap") }}
        </Button>
      </div>
      <p
        v-if="showValidation && !hasLocation"
        class="text-sm text-destructive"
      >
        {{ $t("users.address.locationRequired") }}
      </p>
    </div>

    <MapPicker
      v-if="isMapOpen"
      :center="mapCenter"
      :initial="mapInitial"
      :boundary="activeBoundary"
      :zoom="modelValue.districtId ? 14 : 12"
      @confirm="onMapConfirm"
      @cancel="isMapOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { InputLabel } from "@/components";
import Button from "@/components/ui/Button.vue";
import { useLocationsComposable } from "@/composables/useLocations.composable";
import type {
  DisplayBoundaryDTO,
  DisplayCityDTO,
  DisplayDistrictDTO,
} from "@/integration";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import MapPicker from "./MapPicker.vue";
import type { AddressFormValue } from "./address.types";

const props = defineProps<{
  modelValue: AddressFormValue;
  showValidation?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: AddressFormValue): void;
  (e: "valid-change", value: boolean): void;
}>();

const { locale } = useI18n();
const locations = useLocationsComposable();

const isCityResultsOpen = ref(false);
const isDistrictResultsOpen = ref(false);
const citySearch = ref(
  props.modelValue.cityNameEn || props.modelValue.cityNameAr || "",
);
const districtSearch = ref(
  props.modelValue.districtNameEn || props.modelValue.districtNameAr || "",
);
const cityCoords = ref<{ lat: number; lng: number } | null>(null);
const activeBoundary = ref<DisplayBoundaryDTO | null>(null);
const loadingBoundary = ref(false);
const isMapOpen = ref(false);
const isGeocoding = ref(false);

const RIYADH = { lat: 24.7136, lng: 46.6753 };

const cityOptions = computed(() => locations.cities.value);
const loadingCities = computed(() => locations.loadingCities.value);
const loadingDistricts = computed(() => locations.loadingDistricts.value);

const hasCity = computed(
  () => !!(props.modelValue.cityNameEn || props.modelValue.cityNameAr),
);
const hasLocation = computed(
  () => props.modelValue.latitude != null && props.modelValue.longitude != null,
);
const isValid = computed(() => hasCity.value && hasLocation.value);
const canPickOnMap = computed(() => !!cityCoords.value || hasLocation.value);
const mapCenter = computed(() => cityCoords.value ?? RIYADH);
const mapInitial = computed(() =>
  hasLocation.value
    ? {
        lat: props.modelValue.latitude!,
        lng: props.modelValue.longitude!,
      }
    : null,
);

const districts = computed<DisplayDistrictDTO[]>(() =>
  props.modelValue.cityId
    ? locations.districtsByCity.value[props.modelValue.cityId] ?? []
    : [],
);

const filteredDistricts = computed<DisplayDistrictDTO[]>(() => {
  const term = districtSearch.value.trim().toLowerCase();
  if (!term) return districts.value;
  return districts.value.filter(
    (district) =>
      district.arabicName.toLowerCase().includes(term) ||
      district.englishName.toLowerCase().includes(term),
  );
});

watch(
  isValid,
  (value) => {
    emit("valid-change", value);
  },
  { immediate: true },
);

watch(
  () => props.modelValue,
  (value) => {
    citySearch.value = value.cityNameEn || value.cityNameAr || "";
    districtSearch.value = value.districtNameEn || value.districtNameAr || "";
    if (value.latitude != null && value.longitude != null && !cityCoords.value) {
      cityCoords.value = { lat: value.latitude, lng: value.longitude };
    }
  },
  { deep: true },
);

function updateAddress(patch: Partial<AddressFormValue>) {
  emit("update:modelValue", {
    ...props.modelValue,
    ...patch,
  });
}

function localizedName(item: DisplayCityDTO | DisplayDistrictDTO) {
  return locale.value === "ar" ? item.arabicName : item.englishName;
}

async function openCityResults() {
  isCityResultsOpen.value = true;
  await locations.searchCities(citySearch.value);
}

function onCityInput(event: Event) {
  citySearch.value = (event.target as HTMLInputElement).value;
  isCityResultsOpen.value = true;
  void locations.searchCities(citySearch.value);
}

// Delay closing so a click on a result registers before the list disappears.
function closeCityResultsSoon() {
  setTimeout(() => {
    isCityResultsOpen.value = false;
  }, 150);
}

function onDistrictInput(event: Event) {
  districtSearch.value = (event.target as HTMLInputElement).value;
  isDistrictResultsOpen.value = true;
}

function closeDistrictResultsSoon() {
  setTimeout(() => {
    isDistrictResultsOpen.value = false;
  }, 150);
}

async function selectCity(city: DisplayCityDTO) {
  isCityResultsOpen.value = false;
  citySearch.value = localizedName(city);
  cityCoords.value =
    city.lat != null && city.lng != null ? { lat: city.lat, lng: city.lng } : null;

  updateAddress({
    cityId: city.id,
    cityNameAr: city.arabicName,
    cityNameEn: city.englishName,
    districtId: undefined,
    districtNameAr: undefined,
    districtNameEn: undefined,
    street: undefined,
    latitude: undefined,
    longitude: undefined,
  });

  districtSearch.value = "";
  await locations.fetchDistricts(city.id);
}

async function openDistrictResults() {
  if (!props.modelValue.cityId) return;
  isDistrictResultsOpen.value = true;
  await locations.fetchDistricts(props.modelValue.cityId);
}

function selectDistrict(district: DisplayDistrictDTO) {
  isDistrictResultsOpen.value = false;
  districtSearch.value = localizedName(district);
  updateAddress({
    districtId: district.id,
    districtNameAr: district.arabicName,
    districtNameEn: district.englishName,
    street: undefined,
    latitude: undefined,
    longitude: undefined,
  });
}

async function openMapPicker() {
  loadingBoundary.value = true;
  try {
    activeBoundary.value =
      (props.modelValue.districtId
        ? await locations.fetchDistrictBoundary(props.modelValue.districtId)
        : props.modelValue.cityId
          ? await locations.fetchCityBoundary(props.modelValue.cityId)
          : null) ?? null;
  } finally {
    loadingBoundary.value = false;
  }
  isMapOpen.value = true;
}

async function onMapConfirm(coords: { lat: number; lng: number }) {
  isMapOpen.value = false;
  updateAddress({
    latitude: coords.lat,
    longitude: coords.lng,
  });

  isGeocoding.value = true;
  try {
    const label = await locations.reverseGeocode(coords.lat, coords.lng);
    if (label) updateAddress({ street: label });
  } finally {
    isGeocoding.value = false;
  }
}
</script>