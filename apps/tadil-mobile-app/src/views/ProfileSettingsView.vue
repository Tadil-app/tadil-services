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
        <IonCard class="ion-padding">
          <IonItem button lines="none" fill="clear" color="" :detail="false" @click="openUpdateProfileModal">
            <CircleUserRound aria-hidden="true" slot="start" class="me-2" />
            <IonLabel>{{ $t("profileSettings.profile.title") }}</IonLabel>
          </IonItem>
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
  modalController,
} from "@ionic/vue";
import {
  CircleUserRound,
  Languages,
  LogOut,
  Moon,
} from "lucide-vue-next";
import { SecondaryHeader } from "@/components";
import { onMounted, ref } from "vue";
import UpdateProfileModal from "./auth/components/UpdateProfileModal.vue";

const languageStore = useLanguageStore();
const themeStore = useThemeStore();
const authStore = useAuthStore();

const isReady = ref(false);

async function openUpdateProfileModal() {
  const modal = await modalController.create({
    component: UpdateProfileModal,
  });
  modal.present();
}

onMounted(async () => {
  if (!authStore.userInfo) {
    await authStore.fetchProfile();
  }
  isReady.value = true;
});
</script>
