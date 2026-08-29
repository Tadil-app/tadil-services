<template>
  <IonPage>
    <SecondaryHeader :title="$t('customModel.title')" :default-href="`/customer/new-order/${category}/model-type-selection`" />
    <IonContent class="ion-padding">
      <div class="custom-category-grid">
        <IonCard v-for="(cat, index) in customCategories" :key="cat.value" :button="true" :class="['custom-category-card', index % 2 ? 'custom-category-card--sand' : 'custom-category-card--rose']" @click="selectAndNext(cat.value)">
          <div class="custom-category-card__content">
            <component :is="cat.icon" />
            <strong>{{ $t(`customModel.categories.${cat.value}`) }}</strong>
          </div>
        </IonCard>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonCard } from "@ionic/vue";
import { Shirt, Pocket as Pants, Ghost as Dress, Wind as Sweater, UserRound as Coat, Briefcase as Suit } from "lucide-vue-next";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCustomModel } from "./useCustomModel.composable";
import { ModelCategory } from "@/integration/dtos";
import { SecondaryHeader } from "@/components";

const props = defineProps<{
  category: ModelCategory;
}>();

const { selectedCategory } = useCustomModel();
const router = useRouter();

const customCategories = computed(() => [
  { value: "shirt", icon: Shirt },
  { value: "pants", icon: Pants },
  { value: "dress", icon: Dress },
  { value: "sweater", icon: Sweater },
  { value: "coat", icon: Coat },
  { value: "suit", icon: Suit },
]);

function selectAndNext(value: string) {
  selectedCategory.value = value;
  router.push({
    name: "customer-new-order-custom-upload",
    params: { category: props.category },
  });
}
</script>

<style scoped>
.custom-category-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  padding-block: 18px 24px;
}

.custom-category-card {
  --background: #fffdfb;
  position: relative;
  aspect-ratio: 1;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--card-border);
  border-radius: 18px;
  color: var(--card-accent);
  background: #fffdfb;
  box-shadow: 0 3px 7px rgba(109, 15, 47, 0.1);
}

.custom-category-card::before {
  position: absolute;
  inset: 27% 0;
  content: "";
  background: var(--card-band);
}

.custom-category-card--rose {
  --card-band: #f9e8ec;
  --card-border: #dfb3be;
  --card-accent: var(--ion-color-primary);
}

.custom-category-card--sand {
  --card-band: #fff0e5;
  --card-border: #e4c2ad;
  --card-accent: var(--ion-color-tertiary);
}

.custom-category-card__content {
  position: relative;
  z-index: 1;
  display: grid;
  height: 100%;
  place-content: center;
  place-items: center;
  gap: 10px;
}

.custom-category-card__content svg {
  width: 48px;
  height: 48px;
}

.custom-category-card__content strong {
  font-size: 20px;
}
</style>
