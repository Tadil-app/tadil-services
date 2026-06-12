<template>
  <IonPage>
    <SecondaryHeader
      :title="$t('customModel.title')"
      :default-href="`/customer/new-order/${category}/model-type-selection`"
    />
    <IonContent class="ion-padding">
      <div class="grid grid-cols-2 gap-4 mt-4">
        <IonCard
          v-for="cat in customCategories"
          :key="cat.value"
          :button="true"
          class="m-0 aspect-square flex items-center justify-center bg-tertiary/10 border-2 border-tertiary/20"
          @click="selectAndNext(cat.value)"
        >
          <div class="flex flex-col items-center gap-2">
            <component :is="cat.icon" class="w-10 h-10 text-tertiary" />
            <p class="text-lg font-bold text-tertiary">
              {{ $t(`customModel.categories.${cat.value}`) }}
            </p>
          </div>
        </IonCard>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonCard,
} from "@ionic/vue";
import { 
  Shirt, 
  Pocket as Pants, 
  Ghost as Dress, 
  Wind as Sweater, 
  UserRound as Coat, 
  Briefcase as Suit 
} from "lucide-vue-next";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCustomModel } from "./useCustomModel.composable";
import { ModelCategory } from "@/integration/dtos";
import { SecondaryHeader } from "@/components";
import { useRequireAuth } from "@/composables";

const props = defineProps<{
  category: ModelCategory;
}>();

const { selectedCategory } = useCustomModel();
const router = useRouter();
const { promptAuth } = useRequireAuth();

const customCategories = computed(() => [
  { value: "shirt", icon: Shirt },
  { value: "pants", icon: Pants },
  { value: "dress", icon: Dress },
  { value: "sweater", icon: Sweater },
  { value: "coat", icon: Coat },
  { value: "suit", icon: Suit },
]);

async function selectAndNext(value: string) {
  if (!(await promptAuth())) return;

  selectedCategory.value = value;
  router.push({
    name: "customer-new-order-custom-upload",
    params: { category: props.category },
    query: { customCategory: value },
  });
}
</script>

<style scoped>
</style>
