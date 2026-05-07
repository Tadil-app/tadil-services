<template>
  <IonHeader class="ion-no-border">
    <IonToolbar>
      <IonButtons v-if="showBackButton" slot="start">
        <IonBackButton color="light" :default-href="defaultHref" text="" />
      </IonButtons>
      <div class="ps-4 text-white">
        <p v-if="typeof title === 'string'" class="text-3xl font-semibold">
          {{ title }}
        </p>
        <TranslatedName v-else :names="title" class="text-3xl font-semibold" />
        <p v-if="subtitle" class="text-sm font-medium opacity-80 mt-0.5">
          {{ subtitle }}
        </p>
      </div>
      <!-- Extra content slot -->
      <slot />
    </IonToolbar>
  </IonHeader>
</template>

<script setup lang="ts">
import { IonHeader, IonToolbar, IonBackButton, IonButtons } from "@ionic/vue";
import TranslatedName from "./TranslatedName.vue";
import type { TranslatedNameObject } from "@/types/cart.types";

withDefaults(
  defineProps<{
    title: string | TranslatedNameObject;
    subtitle?: string;
    defaultHref?: string;
    showBackButton?: boolean;
  }>(),
  {
    showBackButton: true,
    defaultHref: "customer/dashboard",
  },
);
</script>

<style scoped>
ion-toolbar {
  --background: linear-gradient(
    to right,
    var(--ion-color-primary),
    var(--ion-color-secondary)
  );
  --color: white;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  --min-height: 80px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

body.dark ion-toolbar {
  border-bottom: 1px solid var(--ion-border-color);
}
</style>
