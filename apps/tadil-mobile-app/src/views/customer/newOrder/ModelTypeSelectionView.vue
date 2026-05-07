<template>
  <IonPage>
    <SecondaryHeader
      :title="$t('modelMode.title')"
      default-href="/customer/dashboard"
    />
    <IonContent class="ion-padding">
      <IonCard
        :button="true"
        color="primary"
        class="my-6"
        :router-link="{
          name: 'customer-new-order-predefined-model-selection',
          params: { category },
        }"
      >
        <span class="p-6 w-full flex items-center gap-4 space-y-2">
          <Grid3X3 class="w-12 h-12" />
          <div class="space-y-4">
            <p class="text-xl font-semibold">
              {{ $t("modelMode.predefined.title") }}
            </p>
            <p class="text-sm text-start">
              {{ $t("modelMode.predefined.description") }}
            </p>
          </div>
        </span>
      </IonCard>
      <IonCard
        :button="true"
        color="tertiary"
        class="my-6"
        :router-link="{
          name: 'customer-new-order-custom-category-selection',
          params: { category },
        }"
      >
        <span class="p-6 w-full flex items-center gap-4 space-y-2">
          <Upload class="w-12 h-12" />
          <div class="space-y-4">
            <p class="text-xl font-semibold">
              {{ $t("modelMode.custom.title") }}
            </p>
            <p class="text-sm text-start">
              {{ $t("modelMode.custom.description") }}
            </p>
          </div>
        </span>
      </IonCard>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ModelCategory } from "@/integration/dtos";
import {
  IonContent,
  IonPage,
  IonCard,
} from "@ionic/vue";
import { Grid3X3, Upload } from "lucide-vue-next";
import { SecondaryHeader } from "@/components";

defineProps<{
  category: ModelCategory;
}>();
</script>

<style scoped>
</style>
