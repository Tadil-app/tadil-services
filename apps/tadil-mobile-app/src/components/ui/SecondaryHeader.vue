<template>
  <IonHeader class="ion-no-border">
    <IonToolbar>
      <IonButtons v-if="showBackButton" slot="start">
        <IonButton
          v-if="forceDefaultHref"
          fill="clear"
          color="light"
          class="force-back"
          :aria-label="$t('login.form.buttons.back')"
          @click="goToDefaultHref"
        >
          <IonIcon
            slot="icon-only"
            :icon="isRtl ? chevronForward : chevronBack"
            aria-hidden="true"
          />
        </IonButton>
        <IonBackButton
          v-else
          color="light"
          :default-href="defaultHref"
          text=""
        />
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
import {
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonButton,
  IonIcon,
  useIonRouter,
} from "@ionic/vue";
import { chevronBack, chevronForward } from "ionicons/icons";
import { computed } from "vue";
import TranslatedName from "./TranslatedName.vue";
import type { TranslatedNameObject } from "@/types/cart.types";
import { useLanguageStore } from "@/stores";

const props = withDefaults(
  defineProps<{
    title: string | TranslatedNameObject;
    subtitle?: string;
    defaultHref?: string;
    showBackButton?: boolean;
    // Skip history. IonBackButton returns to whatever opened this page,
    // which after signup is /login, and the guest guard then leaves the cart.
    forceDefaultHref?: boolean;
  }>(),
  {
    showBackButton: true,
    defaultHref: "customer/dashboard",
    forceDefaultHref: false,
  }
);

const ionRouter = useIonRouter();
const languageStore = useLanguageStore();
// ion-icon only mirrors named chevrons. This icon is an SVG object, so the
// direction has to be chosen here or the arrow keeps pointing left in Arabic.
const isRtl = computed(() => languageStore.currentLocale.direction === "rtl");

function goToDefaultHref() {
  ionRouter.navigate(props.defaultHref, "back", "pop");
}
</script>

<style scoped>
ion-toolbar {
  --background: var(--ion-color-primary);
  --color: white;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  --min-height: 112px;
  --padding-top: calc(var(--ion-safe-area-top, 0px) + 24px);
  --padding-bottom: 24px;
}

body.dark ion-toolbar {
  border-bottom: 1px solid var(--ion-border-color);
}

.force-back {
  --padding-start: 8px;
  --padding-end: 8px;
}
</style>
