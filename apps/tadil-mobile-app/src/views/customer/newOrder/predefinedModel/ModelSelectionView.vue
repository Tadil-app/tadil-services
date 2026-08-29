<template>
  <IonPage>
    <SecondaryHeader :title="$t('predefinedModelsList.title')" default-href="/customer/new-order/category-selection" />
    <IonContent class="ion-padding">
      <IonRefresher slot="fixed" @ionRefresh="onRefresh">
        <IonRefresherContent refreshing-spinner="bubbles" />
      </IonRefresher>
      <div class="model-grid">
        <IonCard v-if="isLoadingModels" v-for="i in 4" :key="i" class="model-card">
          <IonSkeletonText animated class="h-80 w-full" />
        </IonCard>
        <IonCard
          v-for="model in models"
          :key="model.id"
          :button="true"
          class="model-card"
          :router-link="{
            name: 'customer-new-order-predefined-model-gallery',
            params: { category, modelId: model.id },
          }"
          @click="selectedModel = model"
        >
          <div class="model-card__body">
            <ImageContainer :imageUrl="model.thumbnailImageUrl" :alt="model.englishName" class="model-card__image" />
            <TranslatedName :names="model" class="model-card__title" />
          </div>
        </IonCard>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { useToast } from "@/composables";
import { ModelCategory } from "@/integration/dtos";
import { IonPage, RefresherCustomEvent, IonContent, IonRefresher, IonRefresherContent, IonCard, IonSkeletonText } from "@ionic/vue";
import { usePredefinedModel } from "./usePredefinedModel.composable";
import { onBeforeMount, onBeforeUnmount } from "vue";
import { ImageContainer, TranslatedName, SecondaryHeader } from "@/components";

const { dismissToast } = useToast();

const props = defineProps<{
  category: ModelCategory;
}>();
const { isLoadingModels, models, selectedModel, getModels, resetSelection } = usePredefinedModel();

async function onRefresh(event: RefresherCustomEvent) {
  await getModels(props.category);
  event.target.complete();
}

onBeforeMount(() => {
  resetSelection();
  getModels(props.category);
});

onBeforeUnmount(() => {
  dismissToast();
});
</script>

<style scoped>
.model-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  padding-block: 8px 24px;
}

.model-card {
  --background: #fffdfb;
  margin: 0;
  overflow: hidden;
  border: 1px solid #e8bfc8;
  border-radius: 20px;
  box-shadow: 0 3px 8px rgba(109, 15, 47, 0.08);
}

.model-card__body {
  display: grid;
  grid-template-rows: minmax(190px, 1fr) auto;
  min-height: 278px;
}

.model-card__image {
  --background: #fffdfb;
  aspect-ratio: auto;
  background: #fffdfb;
}

.model-card__title {
  overflow: hidden;
  padding: 12px 8px 16px;
  color: var(--ion-color-primary);
  font-size: 19px;
  font-weight: 600;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
