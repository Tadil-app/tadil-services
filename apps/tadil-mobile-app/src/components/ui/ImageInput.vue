<template>
  <div
    id="image-source-modal-trigger"
    class="w-full aspect-3/4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4"
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
    ref="imageSourceModal"
    trigger="image-source-modal-trigger"
    :initial-breakpoint="1"
    :breakpoints="[0, 1]"
    :handle="false"
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
import { ref } from "vue";
import { IonButton, IonModal } from "@ionic/vue";
import { CapacitorException } from "@capacitor/core";

const imageSourceModal = ref();

const imageUrl = defineModel<string>();

async function uploadImage(source: CameraSource) {
  if (imageSourceModal.value) imageSourceModal.value.$el.dismiss();
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
    imageUrl.value = webPath;
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
</script>

<style scoped>
ion-modal {
  --height: auto;
}
</style>
