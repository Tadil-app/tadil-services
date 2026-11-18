<template>
  <IonModal :is-open="isOpen" @did-dismiss="close" @will-present="load">
    <IonHeader>
      <IonToolbar>
        <IonTitle>{{ $t("waybill.title") }}</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="close">{{ $t("waybill.close") }}</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <div class="flex flex-col h-full">
        <div class="flex-1 bg-white">
          <div v-if="isLoading" class="flex justify-center py-20">
            <IonSpinner name="crescent" />
          </div>
          <div v-else-if="hasError" class="text-center py-20 px-6 text-medium">
            <p>{{ $t("waybill.loadFailed") }}</p>
            <IonButton fill="outline" class="mt-4" @click="load">{{ $t("waybill.retry") }}</IonButton>
          </div>
          <iframe
            v-else-if="previewHtml"
            :srcdoc="previewHtml"
            :title="$t('waybill.title')"
            class="w-full h-full border-0"
            data-testid="waybill-frame"
          />
        </div>

        <div class="p-4 border-t border-border bg-background space-y-2">
          <IonButton expand="block" :disabled="!link" @click="print" data-testid="waybill-print">
            <Printer class="w-5 h-5 me-2" />
            {{ $t("waybill.print") }}
          </IonButton>
          <p class="text-xs text-center text-medium">{{ $t("waybill.printHint") }}</p>
        </div>
      </div>
    </IonContent>
  </IonModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { Printer } from "lucide-vue-next";
import { apiClient, apiInstance } from "@/integration/api";
import { WaybillLinkDTO } from "@/integration/dtos";
import { useAuthStore } from "@/stores";
import { openExternalUrl } from "@/utils";
import { useToast } from "@/composables";
import { useI18n } from "vue-i18n";

/**
 * Shows the order waybill (the label for the garment bag) and prints it.
 * Phones cannot print from inside the app, so printing opens the same page
 * in the phone's browser, which offers Print and Save as PDF.
 */
const props = defineProps<{
  orderId: string;
  role: "tailor" | "courier";
}>();

const isOpen = defineModel<boolean>("isOpen", { default: false });

const authStore = useAuthStore();
const { t } = useI18n();
const { showToast } = useToast();
const link = ref<WaybillLinkDTO | null>(null);
const previewHtml = ref("");
const isLoading = ref(false);
const hasError = ref(false);
let fetchedAt = 0;

async function load() {
  // Links expire; fetch a fresh one each time the waybill is opened.
  isLoading.value = true;
  hasError.value = false;
  try {
    const { data } =
      props.role === "tailor"
        ? await apiClient.tailorControllerGetWaybill(authStore.userId, props.orderId)
        : await apiClient.courierControllerGetWaybill(authStore.userId, props.orderId);
    link.value = data;
    fetchedAt = Date.now();
    // Load the page over the app's own API connection and show it inline,
    // rather than pointing a frame at the URL, which phones may block.
    const { data: html } = await apiInstance.instance.get<string>(data.viewUrl, {
      responseType: "text",
      transformResponse: (body) => body,
    });
    previewHtml.value = html;
  } catch (error) {
    console.error("Failed to load waybill", error);
    link.value = null;
    previewHtml.value = "";
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
}

async function print() {
  if (!link.value) return;
  // Refresh a link that is about to expire before handing it to the browser.
  const ageMinutes = (Date.now() - fetchedAt) / 60_000;
  if (ageMinutes > link.value.expiresInMinutes - 5) {
    await load();
    if (!link.value) return;
  }
  const opened = await openExternalUrl(link.value.printUrl);
  if (!opened) {
    showToast({ message: t("waybill.printFailed"), color: "danger" });
  }
}

function close() {
  isOpen.value = false;
}
</script>
