<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { onMounted } from "vue";

onMounted(() => {
  setTimeout(() => {
    const webSplash = document.getElementById("custom-splash");
    if (webSplash) {
      webSplash.classList.add("fade-out");
      setTimeout(() => webSplash.remove(), 600);
    }
  }, 1500);
});
</script>
