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
          class="model-card"
          role="button"
          tabindex="0"
          @click="openModel(model)"
          @keydown.enter="openModel(model)"
          @keydown.space.prevent="openModel(model)"
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
import { DisplayModelDTO, ModelCategory } from "@/integration/dtos";
import { IonPage, RefresherCustomEvent, IonContent, IonRefresher, IonRefresherContent, IonCard, IonSkeletonText } from "@ionic/vue";
import { usePredefinedModel } from "./usePredefinedModel.composable";
import { onBeforeMount, onBeforeUnmount } from "vue";
import { ImageContainer, TranslatedName, SecondaryHeader } from "@/components";
import { useRouter } from "vue-router";

const { dismissToast } = useToast();
const router = useRouter();

const props = defineProps<{
  category: ModelCategory;
}>();
const { isLoadingModels, models, selectedModel, getModels, resetSelection } = usePredefinedModel();

async function onRefresh(event: RefresherCustomEvent) {
  await getModels(props.category);
  event.target.complete();
}

function openModel(model: DisplayModelDTO) {
  selectedModel.value = model;
  router.push({
    name: "customer-new-order-predefined-model-gallery",
    params: { category: props.category, modelId: model.id },
  });
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
  cursor: pointer;
  border: 1px solid #e8bfc8;
  border-radius: 20px;
  box-shadow: 0 3px 8px rgba(109, 15, 47, 0.08);
}

.model-card__body {
  display: grid;
  grid-template-rows: minmax(190px, 1fr) auto;
  min-height: 278px;
  pointer-events: none;
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
