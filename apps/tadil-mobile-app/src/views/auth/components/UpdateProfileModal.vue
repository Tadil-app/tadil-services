<template>
  <IonHeader>
    <IonToolbar>
      <IonButtons slot="start">
        <IonButton @click="closeModal">{{ $t("common.buttons.cancel") }}</IonButton>
      </IonButtons>
      <IonTitle>{{ $t("profileSettings.profile.title") }}</IonTitle>
      <IonButtons slot="end">
        <IonButton :disabled="isLoading" @click="handleUpdate">
          <IonSpinner v-if="isLoading" name="crescent" />
          <span v-else>{{ $t("common.buttons.save") }}</span>
        </IonButton>
      </IonButtons>
    </IonToolbar>
  </IonHeader>
  <IonContent class="ion-padding">
    <div class="space-y-4">
      <IonItem>
        <IonInput
          v-model="form.firstName"
          :label="$t('profileSettings.profile.firstName')"
          label-placement="stacked"
          type="text"
          required
        />
      </IonItem>
      <IonItem>
        <IonInput
          v-model="form.lastName"
          :label="$t('profileSettings.profile.lastName')"
          label-placement="stacked"
          type="text"
          required
        />
      </IonItem>
      <IonItem>
        <IonInput
          v-model="form.email"
          :label="$t('profileSettings.profile.email')"
          label-placement="stacked"
          type="email"
        />
      </IonItem>
      <IonItem lines="none">
        <IonInput
          :value="authStore.userInfo?.phone"
          :label="$t('profileSettings.profile.phoneNumber')"
          label-placement="stacked"
          type="tel"
          readonly
        />
      </IonItem>
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButtons,
  IonButton,
  IonSpinner,
  modalController,
  toastController,
} from "@ionic/vue";
import { reactive, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const authStore = useAuthStore();
const isLoading = ref(false);

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
});

onMounted(() => {
  if (authStore.userInfo) {
    form.firstName = authStore.userInfo.firstName;
    form.lastName = authStore.userInfo.lastName;
    form.email = authStore.userInfo.email || "";
  }
});

const closeModal = () => modalController.dismiss();

async function handleUpdate() {
  if (!form.firstName || !form.lastName) return;

  isLoading.value = true;
  try {
    await authStore.updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
    });
    closeModal();
  } catch (error) {
    console.error("Failed to update profile", error);
    const toast = await toastController.create({
      message: t("profileSettings.profile.updateError"),
      duration: 2000,
      color: "danger",
    });
    toast.present();
  } finally {
    isLoading.value = false;
  }
}
</script>
