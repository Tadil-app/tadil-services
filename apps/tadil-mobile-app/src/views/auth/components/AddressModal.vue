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
      <IonItem>
        <IonInput
          v-model="form.city"
          :label="$t('profileSettings.profile.city')"
          label-placement="stacked"
          type="text"
          required
        />
      </IonItem>
      <IonItem>
        <IonInput
          v-model="form.district"
          :label="$t('profileSettings.profile.district')"
          label-placement="stacked"
          type="text"
        />
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
} from "@ionic/vue";
import { reactive, ref, onMounted } from "vue";

const props = defineProps<{
  addressId?: string;
}>();

const authStore = useAuthStore();
const isLoading = ref(false);

const form = reactive({
  city: "",
  district: "",
  street: "",
});

onMounted(() => {
  if (props.addressId) {
    const addr = authStore.userAddresses.find(a => a.id === props.addressId);
    if (addr) {
      form.city = addr.city;
      form.district = addr.district || "";
      form.street = addr.street || "";
    }
  }
});

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
