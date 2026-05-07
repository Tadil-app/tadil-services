<template>
  <IonPage>
    <SecondaryHeader
      :title="$t('predefinedModelsList.title')"
      default-href="/customer/new-order/category-selection"
    />
    <IonContent class="ion-padding">
      <IonRefresher slot="fixed" @ionRefresh="onRefresh">
        <IonRefresherContent refreshing-spinner="bubbles" />
      </IonRefresher>
      <div class="grid grid-cols-2 gap-4">
        <IonCard v-if="isLoadingModels" v-for="i in 4" :key="i">
          <IonSkeletonText animated class="h-80 w-full" />
        </IonCard>
        <IonCard
          v-for="model in models"
          :key="model.id"
          :button="true"
          :router-link="{
            name: 'customer-new-order-predefined-model-gallery',
            params: { category, modelId: model.id },
          }"
          @click="selectedModel = model"
        >
          <div class="h-60 grid grid-rows-[1fr_auto]">
            <ImageContainer
              :imageUrl="model.thumbnailImageUrl"
              :alt="model.englishName"
            />
            <TranslatedName
              :names="model"
              class="p-2 text-lg text-center font-medium truncate"
            />
          </div>
        </IonCard>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { useToast } from "@/composables";
import { ModelCategory } from "@/integration/dtos";
import {
  IonPage,
  RefresherCustomEvent,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonSkeletonText,
} from "@ionic/vue";
import { usePredefinedModel } from "./usePredefinedModel.composable";
import { onBeforeMount, onBeforeUnmount } from "vue";
import { ImageContainer, TranslatedName, SecondaryHeader } from "@/components";

const { dismissToast } = useToast();

const props = defineProps<{
  category: ModelCategory;
}>();
const { isLoadingModels, models, selectedModel, getModels, resetSelection } =
  usePredefinedModel();

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
ion-toolbar {
  --background: linear-gradient(to right, #4f46e5, #9333ea);
  --color: white;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  --min-height: 80px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}
</style>
