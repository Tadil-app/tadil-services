<template>
  <IonHeader>
    <IonToolbar>
      <IonButtons slot="start">
        <IonButton @click="closeModal">{{ $t("common.buttons.cancel") }}</IonButton>
      </IonButtons>
      <IonTitle>{{ addressId ? $t("profileSettings.profile.editAddress") : $t("profileSettings.profile.addAddress") }}</IonTitle>
      <IonButtons slot="end">
        <IonButton :disabled="isLoading || !canSave" @click="handleSubmit">
          <IonSpinner v-if="isLoading" name="crescent" />
          <span v-else>{{ $t("common.buttons.save") }}</span>
        </IonButton>
      </IonButtons>
    </IonToolbar>
  </IonHeader>
  <IonContent class="ion-padding">
    <div class="space-y-4">
      <IonItem button :detail="true" @click="openCityPicker">
        <IonLabel>
          <p class="picker-label">{{ $t("profileSettings.profile.city") }}</p>
          <span v-if="cityLabel">{{ cityLabel }}</span>
          <span v-else class="placeholder">{{ $t("profileSettings.profile.selectCity") }}</span>
        </IonLabel>
      </IonItem>

      <IonItem
        button
        :detail="true"
        :disabled="!selectedCityId || locationsStore.loadingDistricts"
        @click="openDistrictPicker"
      >
        <IonLabel>
          <p class="picker-label">{{ $t("profileSettings.profile.district") }}</p>
          <span v-if="districtLabel">{{ districtLabel }}</span>
          <span v-else class="placeholder">{{ $t("profileSettings.profile.selectDistrict") }}</span>
        </IonLabel>
      </IonItem>

      <IonItem button :detail="true" :disabled="!canPickOnMap || loadingBoundary" @click="openMapPicker">
        <IonLabel>
          <p class="picker-label">{{ $t("profileSettings.profile.location") }}</p>
          <span v-if="hasLocation">{{ $t("profileSettings.profile.locationSet") }}</span>
          <span v-else class="placeholder">{{ $t("profileSettings.profile.pickOnMap") }}</span>
        </IonLabel>
        <IonSpinner v-if="loadingBoundary" slot="end" name="crescent" />
      </IonItem>

      <!-- Read-only label: the name of the point chosen on the map. -->
      <IonItem>
        <IonLabel>
          <p class="picker-label">{{ $t("profileSettings.profile.selectedLocation") }}</p>
          <span v-if="isGeocoding" class="placeholder">{{ $t("profileSettings.profile.locating") }}</span>
          <span v-else-if="form.street">{{ form.street }}</span>
          <span v-else class="placeholder">{{ $t("profileSettings.profile.pickOnMapFirst") }}</span>
        </IonLabel>
      </IonItem>
    </div>

    <IonModal :is-open="isCityPickerOpen" @did-dismiss="isCityPickerOpen = false">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{{ $t("profileSettings.profile.selectCity") }}</IonTitle>
          <IonButtons slot="end">
            <IonButton @click="isCityPickerOpen = false">{{ $t("common.buttons.cancel") }}</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            v-model="citySearch"
            :placeholder="$t('profileSettings.profile.searchCity')"
            :debounce="300"
            @ion-input="onCitySearch"
          />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div v-if="locationsStore.loadingCities" class="picker-state">
          <IonSpinner name="crescent" />
        </div>
        <IonList v-else>
          <IonItem
            v-for="city in locationsStore.cities"
            :key="city.id"
            button
            @click="selectCity(city)"
          >
            <IonLabel>{{ localizedName(city) }}</IonLabel>
          </IonItem>
          <div v-if="locationsStore.cities.length === 0" class="picker-state">
            {{ $t("profileSettings.profile.noCitiesFound") }}
          </div>
        </IonList>
      </IonContent>
    </IonModal>

    <IonModal :is-open="isDistrictPickerOpen" @did-dismiss="isDistrictPickerOpen = false">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{{ $t("profileSettings.profile.selectDistrict") }}</IonTitle>
          <IonButtons slot="end">
            <IonButton @click="isDistrictPickerOpen = false">{{ $t("common.buttons.cancel") }}</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            v-model="districtSearch"
            :placeholder="$t('profileSettings.profile.searchDistrict')"
            :debounce="150"
          />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div v-if="locationsStore.loadingDistricts" class="picker-state">
          <IonSpinner name="crescent" />
        </div>
        <IonList v-else>
          <IonItem
            v-for="district in filteredDistricts"
            :key="district.id"
            button
            @click="selectDistrict(district)"
          >
            <IonLabel>{{ localizedName(district) }}</IonLabel>
          </IonItem>
          <div v-if="filteredDistricts.length === 0" class="picker-state">
            {{ $t("profileSettings.profile.noDistrictsFound") }}
          </div>
        </IonList>
      </IonContent>
    </IonModal>

    <IonModal :is-open="isMapPickerOpen" @did-dismiss="isMapPickerOpen = false">
      <StreetMapPicker
        v-if="isMapPickerOpen && mapCenter"
        :center="mapCenter"
        :initial="mapInitial"
        :boundary="activeBoundary"
        :zoom="selectedDistrictId ? 14 : 12"
        @confirm="onMapConfirm"
        @cancel="isMapPickerOpen = false"
      />
    </IonModal>
  </IonContent>

  <!-- Delete is only possible for an address that already exists. -->
  <IonFooter v-if="addressId">
    <IonToolbar>
      <IonButton
        expand="block"
        color="danger"
        fill="clear"
        :disabled="isLoading"
        @click="confirmDelete"
      >
        {{ $t("profileSettings.profile.deleteAddress") }}
      </IonButton>
    </IonToolbar>
  </IonFooter>
</template>

<script setup lang="ts">
import { useAuthStore, useLanguageStore, useLocationsStore } from "@/stores";
import { DisplayBoundaryDTO, DisplayCityDTO, DisplayDistrictDTO } from "@/integration/dtos";
import StreetMapPicker from "./StreetMapPicker.vue";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSearchbar,
  IonButtons,
  IonButton,
  IonSpinner,
  alertController,
  modalController,
} from "@ionic/vue";
import { computed, reactive, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  addressId?: string;
}>();

const authStore = useAuthStore();
const languageStore = useLanguageStore();
const locationsStore = useLocationsStore();
const { t } = useI18n();
const isLoading = ref(false);

const form = reactive({
  cityNameAr: "",
  cityNameEn: "",
  districtNameAr: "",
  districtNameEn: "",
  street: "",
  latitude: null as number | null,
  longitude: null as number | null,
});

const selectedCityId = ref<number | null>(null);
const selectedDistrictId = ref<string | null>(null);
const isCityPickerOpen = ref(false);
const citySearch = ref("");
const isDistrictPickerOpen = ref(false);
const districtSearch = ref("");
const isMapPickerOpen = ref(false);
// Boundary the picked point must stay within (district if chosen, else city).
const activeBoundary = ref<DisplayBoundaryDTO | null>(null);
const loadingBoundary = ref(false);
const isGeocoding = ref(false);
// Falls back to central Riyadh if a city somehow has no coordinates.
const RIYADH = { lat: 24.7136, lng: 46.6753 };
const cityCoords = ref<{ lat: number; lng: number } | null>(null);

const canPickOnMap = computed(() => !!cityCoords.value || form.latitude != null);
const hasLocation = computed(() => form.latitude != null && form.longitude != null);
const hasCity = computed(() => !!(form.cityNameEn || form.cityNameAr));
// A valid address needs a city and a pinned location. District stays optional.
const canSave = computed(() => hasCity.value && hasLocation.value);
const mapCenter = computed(() => cityCoords.value ?? RIYADH);
const mapInitial = computed(() =>
  form.latitude != null && form.longitude != null
    ? { lat: form.latitude, lng: form.longitude }
    : null
);

const isAr = computed(() => languageStore.currentLocale.key === "ar");
const localizedName = (item: DisplayCityDTO | DisplayDistrictDTO) =>
  isAr.value ? item.arabicName : item.englishName;

// Labels shown for the chosen city/district in the viewer's current language.
const cityLabel = computed(() =>
  isAr.value ? form.cityNameAr : form.cityNameEn
);
const districtLabel = computed(() =>
  isAr.value ? form.districtNameAr : form.districtNameEn
);

const districts = computed<DisplayDistrictDTO[]>(() =>
  selectedCityId.value
    ? locationsStore.districtsByCity[selectedCityId.value] ?? []
    : []
);

const filteredDistricts = computed<DisplayDistrictDTO[]>(() => {
  const term = districtSearch.value.trim().toLowerCase();
  if (!term) return districts.value;
  return districts.value.filter(
    (d) =>
      d.arabicName.toLowerCase().includes(term) ||
      d.englishName.toLowerCase().includes(term)
  );
});

onMounted(async () => {
  if (props.addressId) {
    const addr = authStore.userAddresses.find((a) => a.id === props.addressId);
    if (addr) {
      form.cityNameAr = addr.cityNameAr;
      form.cityNameEn = addr.cityNameEn;
      form.districtNameAr = addr.districtNameAr || "";
      form.districtNameEn = addr.districtNameEn || "";
      form.street = addr.street || "";
      form.latitude = addr.latitude ?? null;
      form.longitude = addr.longitude ?? null;
      selectedCityId.value = addr.cityId ?? null;
      selectedDistrictId.value = addr.districtId ?? null;

      // Resolve the city centre (map fallback centre) and load its districts.
      if (addr.cityId != null) {
        await locationsStore.searchCities(addr.cityNameEn);
        const match = locationsStore.cities.find((c) => c.id === addr.cityId);
        if (match && match.lat != null && match.lng != null) {
          cityCoords.value = { lat: match.lat, lng: match.lng };
        }
        await locationsStore.fetchDistricts(addr.cityId);
      }
    }
  }
});

async function openCityPicker() {
  citySearch.value = "";
  isCityPickerOpen.value = true;
  await locationsStore.searchCities("");
}

function onCitySearch() {
  locationsStore.searchCities(citySearch.value);
}

async function selectCity(city: DisplayCityDTO) {
  if (selectedCityId.value !== city.id) {
    // Different city: stored district and pinned location no longer apply.
    form.districtNameAr = "";
    form.districtNameEn = "";
    form.street = "";
    form.latitude = null;
    form.longitude = null;
    selectedDistrictId.value = null;
  }
  form.cityNameAr = city.arabicName;
  form.cityNameEn = city.englishName;
  selectedCityId.value = city.id;
  cityCoords.value =
    city.lat != null && city.lng != null
      ? { lat: city.lat, lng: city.lng }
      : null;
  isCityPickerOpen.value = false;
  await locationsStore.fetchDistricts(city.id);
}

function openDistrictPicker() {
  districtSearch.value = "";
  isDistrictPickerOpen.value = true;
}

function selectDistrict(district: DisplayDistrictDTO) {
  if (selectedDistrictId.value !== district.id) {
    // Different district: a previously pinned point may now be out of bounds.
    form.street = "";
    form.latitude = null;
    form.longitude = null;
  }
  form.districtNameAr = district.arabicName;
  form.districtNameEn = district.englishName;
  selectedDistrictId.value = district.id;
  isDistrictPickerOpen.value = false;
}

async function openMapPicker() {
  // Constrain to the district if one is chosen, otherwise the whole city.
  loadingBoundary.value = true;
  try {
    activeBoundary.value = selectedDistrictId.value
      ? await locationsStore.fetchDistrictBoundary(selectedDistrictId.value)
      : selectedCityId.value
        ? await locationsStore.fetchCityBoundary(selectedCityId.value)
        : null;
  } finally {
    loadingBoundary.value = false;
  }
  isMapPickerOpen.value = true;
}

async function onMapConfirm(coords: { lat: number; lng: number }) {
  form.latitude = coords.lat;
  form.longitude = coords.lng;
  isMapPickerOpen.value = false;
  // Reverse-geocode the chosen point into a readable label.
  isGeocoding.value = true;
  try {
    const label = await locationsStore.reverseGeocode(coords.lat, coords.lng);
    if (label) form.street = label;
  } finally {
    isGeocoding.value = false;
  }
}

const closeModal = () => modalController.dismiss();

async function confirmDelete() {
  if (!props.addressId) return;
  const alert = await alertController.create({
    header: t("profileSettings.profile.deleteConfirmTitle"),
    message: t("profileSettings.profile.deleteConfirmMessage"),
    buttons: [
      { text: t("common.buttons.cancel"), role: "cancel" },
      {
        text: t("profileSettings.profile.deleteAddress"),
        role: "destructive",
        handler: () => {
          void performDelete();
        },
      },
    ],
  });
  await alert.present();
}

async function performDelete() {
  if (!props.addressId) return;
  isLoading.value = true;
  try {
    await authStore.deleteAddress(props.addressId);
    closeModal();
  } catch (error) {
    console.error("Failed to delete address", error);
  } finally {
    isLoading.value = false;
  }
}

async function handleSubmit() {
  // City and a pinned location are required; district is optional.
  if (!canSave.value) return;

  isLoading.value = true;
  try {
    const payload = {
      cityId: selectedCityId.value ?? undefined,
      cityNameAr: form.cityNameAr,
      cityNameEn: form.cityNameEn,
      districtId: selectedDistrictId.value ?? undefined,
      districtNameAr: form.districtNameAr || undefined,
      districtNameEn: form.districtNameEn || undefined,
      street: form.street || undefined,
      latitude: form.latitude ?? undefined,
      longitude: form.longitude ?? undefined,
    };
    if (props.addressId) {
      await authStore.updateAddress(props.addressId, payload);
    } else {
      await authStore.addAddress(payload);
    }
    closeModal();
  } catch (error) {
    console.error("Failed to save address", error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.picker-label {
  font-size: 0.75rem;
  color: var(--ion-color-medium);
  margin-bottom: 4px;
}
.placeholder {
  color: var(--ion-color-medium);
}
.picker-state {
  display: flex;
  justify-content: center;
  padding: 24px;
  color: var(--ion-color-medium);
}
</style>
