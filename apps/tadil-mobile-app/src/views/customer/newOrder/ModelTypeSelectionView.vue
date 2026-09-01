<template>
  <IonPage>
    <SecondaryHeader
      :title="$t('modelMode.title')"
      default-href="/customer/dashboard"
    />
    <IonContent class="ion-padding">
      <div class="mode-list">
        <IonCard
          :button="true"
          class="mode-card mode-card--predefined"
          :router-link="{
            name: 'customer-new-order-predefined-model-selection',
            params: { category },
          }"
        >
          <span class="mode-card__content">
            <Grid3X3 class="mode-card__icon" />
            <span class="mode-card__copy">
              <strong>{{ $t("modelMode.predefined.title") }}</strong>
              <small>{{ $t("modelMode.predefined.description") }}</small>
            </span>
          </span>
        </IonCard>
        <IonCard
          :button="true"
          class="mode-card mode-card--custom"
          :router-link="{
            name: 'customer-new-order-custom-category-selection',
            params: { category },
          }"
        >
          <span class="mode-card__content">
            <Upload class="mode-card__icon" />
            <span class="mode-card__copy">
              <strong>{{ $t("modelMode.custom.title") }}</strong>
              <small>{{ $t("modelMode.custom.description") }}</small>
            </span>
          </span>
        </IonCard>
      </div>
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
.mode-list {
  display: grid;
  gap: 20px;
  padding-top: 20px;
}

.mode-card {
  margin: 0;
  border: 1px solid var(--ion-border-color);
  --background: #fffdfb;
  background: #fffdfb;
  color: var(--ion-text-color);
  box-shadow: 0 5px 14px rgba(109, 15, 47, 0.1);
}

.mode-card--custom {
  --background: #fae9ec;
  border-color: #efd1d8;
  background: #fae9ec;
}

.mode-card__content {
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 132px;
  padding: 24px;
}

.mode-card__icon {
  width: 52px;
  height: 52px;
  flex: none;
  color: var(--ion-color-primary);
}

.mode-card--custom .mode-card__icon {
  color: var(--ion-color-secondary);
}

.mode-card__copy {
  display: grid;
  gap: 8px;
  text-align: start;
}

.mode-card__copy strong {
  color: var(--ion-color-primary);
  font-size: 21px;
}

.mode-card__copy small {
  color: var(--ion-step-400);
  font-size: 15px;
}
</style>
