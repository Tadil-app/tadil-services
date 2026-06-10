<template>
  <IonPage>
    <SecondaryHeader
      :title="$t('profileSettings.title')"
      default-href="/customer/dashboard"
    />
    <IonContent class="ion-padding space-y-4">
      <template v-if="isReady">
        <IonCard class="ion-padding">
          <IonAvatar class="mx-auto">
            <IonImg alt="Avatar" src="/avatar.svg" />
          </IonAvatar>
          <p class="text-center mt-2 text-lg font-medium">
            {{ authStore.userInfo?.firstName }} {{ authStore.userInfo?.lastName }}
          </p>
          <p class="text-center text-sm font-light">
            {{ authStore.userInfo?.phone }}
          </p>
        </IonCard>

        <!-- Profile Section -->
        <IonCard class="ion-padding">
          <IonItem button lines="none" fill="clear" color="" :detail="false" @click="openUpdateProfileModal">
            <CircleUserRound aria-hidden="true" slot="start" class="me-2" />
            <IonLabel>{{ $t("profileSettings.profile.title") }}</IonLabel>
          </IonItem>
        </IonCard>

        <!-- Address Section -->
        <IonCard class="ion-padding">
          <div class="flex justify-between items-center mb-2 px-2">
            <IonLabel class="font-bold">
              {{ $t("profileSettings.profile.addresses") }}
            </IonLabel>
            <IonButton 
              v-if="canAddAddress" 
              fill="clear" 
              size="small" 
              @click="openAddressModal()"
            >
              <Plus class="w-4 h-4 me-1" />
              {{ $t("profileSettings.profile.addAddress") }}
            </IonButton>
          </div>
          <IonList lines="full">
            <div v-if="authStore.userAddresses.length === 0" class="text-center py-4 text-sm text-muted-foreground">
              {{ $t("profileSettings.profile.noAddresses") }}
            </div>
            <IonItem 
              v-for="address in authStore.userAddresses" 
              :key="address.id" 
              button 
              @click="openAddressModal(address.id)"
            >
              <MapPin slot="start" class="me-2 w-5 h-5 text-primary" />
              <IonLabel>
                <h2>{{ cityName(address) }}</h2>
                <p>{{ districtName(address) }} {{ address.street }}</p>
              </IonLabel>
              <Settings2 slot="end" class="w-4 h-4 text-muted-foreground" />
            </IonItem>
          </IonList>
        </IonCard>

        <IonCard class="ion-padding">
          <IonLabel class="font-bold">
            {{ $t("profileSettings.preferences.title") }}
          </IonLabel>
          <IonList lines="none">
            <IonItem button :detail="false">
              <Languages aria-hidden="true" slot="start" class="me-2" />
              <IonSelect
                :label="$t('profileSettings.preferences.language')"
                toggle-icon=""
                :selected-text="languageStore.currentLocale.longLabel"
                @ion-change="languageStore.changeLocale($event.detail.value)"
              >
                <IonSelectOption
                  v-for="locale in languageStore.availableLocales"
                  :key="locale.key"
                  :value="locale"
                >
                  {{ locale.longLabel }}
                </IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem button :detail="false">
              <Moon aria-hidden="true" slot="start" class="me-2" />
              <IonToggle
                color="success"
                label-placement="start"
                :checked="themeStore.currentTheme === 'dark'"
                @ionChange="themeStore.toggleTheme"
              >
                {{ $t("profileSettings.preferences.darkTheme") }}
              </IonToggle>
            </IonItem>
          </IonList>
        </IonCard>

        <IonCard class="ion-padding">
          <IonList lines="none">
            <IonItem button :detail="false" @click="authStore.logout">
              <LogOut aria-hidden="true" class="me-2" slot="start" />
              <IonLabel>{{ $t("profileSettings.identity.logout") }}</IonLabel>
            </IonItem>
          </IonList>
        </IonCard>
      </template>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { useAuthStore, useLanguageStore, useThemeStore } from "@/stores";
import {
  IonContent,
  IonPage,
  IonAvatar,
  IonImg,
  IonList,
  IonItem,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonCard,
  IonButton,
  modalController,
} from "@ionic/vue";
import {
  CircleUserRound,
  Languages,
  LogOut,
  Moon,
  Plus,
  MapPin,
  Settings2,
} from "lucide-vue-next";
import { SecondaryHeader } from "@/components";
import { onMounted, ref, computed } from "vue";
import UpdateProfileModal from "./auth/components/UpdateProfileModal.vue";
import AddressModal from "./profile/components/AddressModal.vue";

const languageStore = useLanguageStore();
const themeStore = useThemeStore();
const authStore = useAuthStore();

// Show the stored bilingual city/district in the viewer's current language.
const cityName = (a: { cityNameAr: string; cityNameEn: string }) =>
  languageStore.currentLocale.key === "ar" ? a.cityNameAr : a.cityNameEn;
const districtName = (a: { districtNameAr?: string; districtNameEn?: string }) =>
  (languageStore.currentLocale.key === "ar" ? a.districtNameAr : a.districtNameEn) ?? "";

const isReady = ref(false);

// Only customers manage addresses in the app. Couriers/tailors get their
// single address from an admin and can only view it here.
const canAddAddress = computed(() => authStore.userRole === 'customer');

async function openUpdateProfileModal() {
  const modal = await modalController.create({
    component: UpdateProfileModal,
  });
  modal.present();
}

async function openAddressModal(addressId?: string) {
  const modal = await modalController.create({
    component: AddressModal,
    componentProps: {
      addressId
    }
  });
  modal.present();
}

onMounted(async () => {
  if (!authStore.userInfo) {
    await authStore.fetchProfile();
  }
  await authStore.fetchAddresses();
  isReady.value = true;
});
</script>
