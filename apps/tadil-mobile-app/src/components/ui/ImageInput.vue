<template>
  <IonCard
    :button="true"
    class="m-0 w-full aspect-3/4 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-step-200"
    @click="pickImage"
  >
    <Upload class="w-16 h-16 text-step-200" />
    <div class="text-center ion-padding-horizontal">
      <p class="font-medium text-step-200">
        {{ $t("common.inputs.imageInput.placeholder") }}
      </p>
      <p class="text-sm mt-1">{{ $t("common.inputs.imageInput.info") }}</p>
    </div>
  </IonCard>
</template>

<script setup lang="ts">
import { Upload } from "lucide-vue-next";
import {
  Camera,
  CameraDirection,
  CameraResultType,
  CameraSource,
} from "@capacitor/camera";
import { IonCard } from "@ionic/vue";
import { CapacitorException } from "@capacitor/core";

const imageUrl = defineModel<string>();

async function pickImage() {
  try {
    const { webPath } = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 100,
      correctOrientation: true,
      direction: CameraDirection.Rear,
      width: 300,
      height: 400,
    });

    if (webPath) {
      imageUrl.value = webPath;
    }
  } catch (error: unknown) {
    if (
      error instanceof CapacitorException &&
      error.message.includes("User cancelled")
    ) {
      return;
    }
    throw error;
  }
}
</script>
