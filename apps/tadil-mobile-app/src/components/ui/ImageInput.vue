<template>
  <div
    class="w-full aspect-3/4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors"
    :class="isDragging ? 'border-primary bg-primary/5' : 'border-step-200'"
    role="button"
    tabindex="0"
    @click="openSourceModal"
    @keydown.enter="openSourceModal"
    @keydown.space.prevent="openSourceModal"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
  >
    <Upload class="w-16 h-16 text-step-200" />
    <div class="text-center">
      <p class="font-medium text-step-200">
        {{ $t("common.inputs.imageInput.placeholder") }}
      </p>
      <p class="text-sm mt-1">{{ $t("common.inputs.imageInput.info") }}</p>
    </div>
  </div>
  <ion-modal
    :is-open="isSourceModalOpen"
    :initial-breakpoint="1"
    :breakpoints="[0, 1]"
    :handle="false"
    @didDismiss="isSourceModalOpen = false"
  >
    <div class="ion-padding space-y-4">
      <p class="text-xl font-semibold">
        {{ $t("common.inputs.imageInput.sourceModal.title") }}
      </p>
      <ion-button
        expand="block"
        color="primary"
        @click="uploadImage(CameraSource.Camera)"
      >
        {{ $t("common.inputs.imageInput.sourceModal.camera") }}
      </ion-button>
      <ion-button
        expand="block"
        color="secondary"
        @click="uploadImage(CameraSource.Photos)"
      >
        {{ $t("common.inputs.imageInput.sourceModal.gallery") }}
      </ion-button>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { Upload } from "lucide-vue-next";
import {
  Camera,
  CameraDirection,
  CameraResultType,
  CameraSource,
} from "@capacitor/camera";
import { onBeforeUnmount, ref } from "vue";
import { IonButton, IonModal } from "@ionic/vue";
import { CapacitorException } from "@capacitor/core";
import { useToast } from "@/composables";
import { useI18n } from "vue-i18n";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const isSourceModalOpen = ref(false);
const isDragging = ref(false);

const imageUrl = defineModel<string>();
const { showToast } = useToast();
const { t } = useI18n();

function revokeBlobUrl(url?: string) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function setImageUrl(url: string) {
  revokeBlobUrl(imageUrl.value);
  imageUrl.value = url;
}

function openSourceModal() {
  isSourceModalOpen.value = true;
}

function onDrop(event: DragEvent) {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (!file?.type.startsWith("image/")) return;

  if (file.size > MAX_FILE_SIZE_BYTES) {
    showToast({
      message: t("common.inputs.imageInput.fileTooLarge"),
      color: "warning",
    });
    return;
  }

  setImageUrl(URL.createObjectURL(file));
}

async function uploadImage(source: CameraSource) {
  isSourceModalOpen.value = false;
  try {
    const { webPath } = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: source,
      quality: 100,
      correctOrientation: true,
      direction: CameraDirection.Rear,
      width: 300,
      height: 400,
    });
    if (webPath) {
      setImageUrl(webPath);
    }
  } catch (error: unknown) {
    if (!(error instanceof CapacitorException)) throw error;
    if (
      error instanceof CapacitorException &&
      error.message.includes("User cancelled")
    )
      return;
    throw error.message;
  }
}

onBeforeUnmount(() => {
  revokeBlobUrl(imageUrl.value);
});
</script>

<style scoped>
ion-modal {
  --height: auto;
}
</style>
