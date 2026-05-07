<template>
  <IonButton @click="startScan" color="secondary">
    <QrCode slot="icon-only" />
  </IonButton>
</template>

<script setup lang="ts">
import {
  BarcodeScanner,
  BarcodeFormat,
} from "@capacitor-mlkit/barcode-scanning";
import { IonButton } from "@ionic/vue";
import { QrCode } from "lucide-vue-next";

const scannedData = defineModel<string>();

const startScan = async () => {
  const { camera } = await BarcodeScanner.checkPermissions();
  if (camera !== "granted") {
    await BarcodeScanner.requestPermissions();
  }

  document.querySelector("body")?.classList.add("barcode-scanner-active");

  try {
    const result = await BarcodeScanner.scan({
      formats: [BarcodeFormat.QrCode],
    });

    if (result.barcodes.length > 0) {
      const rawValue = result.barcodes[0].rawValue;
      scannedData.value = rawValue;
    }
  } finally {
    document.querySelector("body")?.classList.remove("barcode-scanner-active");
  }
};
</script>

<style>
body.barcode-scanner-active {
  --ion-background-color: transparent;
  visibility: hidden;
}
</style>
