<template>
  <IonHeader>
    <IonToolbar>
      <IonButtons slot="start">
        <IonButton @click="closeModal">{{ $t("common.buttons.cancel") }}</IonButton>
      </IonButtons>
      <IonTitle>{{ addressId ? $t("profileSettings.profile.editAddress") : $t("profileSettings.profile.addAddress") }}</IonTitle>
      <IonButtons slot="end">
        <IonButton :disabled="isLoading" @click="handleSubmit">
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
          <span v-if="form.city">{{ form.city }}</span>
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
          <span v-if="form.district">{{ form.district }}</span>
          <span v-else class="placeholder">{{ $t("profileSettings.profile.selectDistrict") }}</span>
        </IonLabel>
      </IonItem>

      <IonItem>
        <IonInput
          v-model="form.street"
          :label="$t('profileSettings.profile.street')"
          label-placement="stacked"
          type="text"
        />
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
  </IonContent>
</template>

<script setup lang="ts">
import { useAuthStore, useLanguageStore, useLocationsStore } from "@/stores";
import { DisplayCityDTO, DisplayDistrictDTO } from "@/integration/dtos";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonLabel,
  IonList,
  IonModal,
  IonSearchbar,
  IonButtons,
  IonButton,
  IonSpinner,
  modalController,
} from "@ionic/vue";
import { computed, reactive, ref, onMounted } from "vue";

const props = defineProps<{
  addressId?: string;
}>();

const authStore = useAuthStore();
const languageStore = useLanguageStore();
const locationsStore = useLocationsStore();
const isLoading = ref(false);

const form = reactive({
  city: "",
  district: "",
  street: "",
});

const selectedCityId = ref<number | null>(null);
const isCityPickerOpen = ref(false);
const citySearch = ref("");
const isDistrictPickerOpen = ref(false);
const districtSearch = ref("");

const localizedName = (item: DisplayCityDTO | DisplayDistrictDTO) =>
  languageStore.currentLocale.key === "ar" ? item.arabicName : item.englishName;

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
      form.city = addr.city;
      form.district = addr.district || "";
      form.street = addr.street || "";

      // Resolve the stored city name to an id so its districts can load.
      await locationsStore.searchCities(addr.city);
      const match = locationsStore.cities.find(
        (c) => c.arabicName === addr.city || c.englishName === addr.city
      );
      if (match) {
        selectedCityId.value = match.id;
        await locationsStore.fetchDistricts(match.id);
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
  const name = localizedName(city);
  if (selectedCityId.value !== city.id) {
    form.district = "";
  }
  form.city = name;
  selectedCityId.value = city.id;
  isCityPickerOpen.value = false;
  await locationsStore.fetchDistricts(city.id);
}

function openDistrictPicker() {
  districtSearch.value = "";
  isDistrictPickerOpen.value = true;
}

function selectDistrict(district: DisplayDistrictDTO) {
  form.district = localizedName(district);
  isDistrictPickerOpen.value = false;
}

const closeModal = () => modalController.dismiss();

async function handleSubmit() {
  if (!form.city) return;

  isLoading.value = true;
  try {
    if (props.addressId) {
      await authStore.updateAddress(props.addressId, {
        city: form.city,
        district: form.district,
        street: form.street,
      });
    } else {
      await authStore.addAddress({
        city: form.city,
        district: form.district,
        street: form.street,
      });
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
