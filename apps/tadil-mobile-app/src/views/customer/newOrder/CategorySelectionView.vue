<template>
  <IonPage>
    <SecondaryHeader
      :title="$t('modelCategory.title')"
      :showBackButton="false"
    />
    <IonContent class="ion-padding">
      <div class="category-list">
        <IonCard
          v-for="category in categories"
          :key="category.value"
          :button="true"
          :class="['category-card', `category-card--${category.tone}`]"
          :router-link="{
            name: 'customer-new-order-model-type-selection',
            params: { category: category.value },
          }"
          @click="selectedCategory = category.value"
        >
          <span class="category-card__content">
            <img
              :src="category.image"
              :alt="$t(`modelCategory.${category.value}`)"
              class="category-card__image"
            />
            <strong class="category-card__title">
              {{ $t(`modelCategory.${category.value}`) }}
            </strong>
            <span class="category-card__arrow" aria-hidden="true">
              <ChevronRight />
            </span>
          </span>
        </IonCard>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ModelCategory } from "@/integration/dtos";
import { IonPage, IonContent, IonCard } from "@ionic/vue";
import { ChevronRight } from "lucide-vue-next";
import { computed } from "vue";
import { SecondaryHeader } from "@/components";

const selectedCategory = defineModel<ModelCategory>();
const categories = computed(() => [
  { value: ModelCategory.Women, tone: "rose", image: "/images/categories/women.jpeg" },
  { value: ModelCategory.Kids, tone: "sand", image: "/images/categories/kids.jpeg" },
  { value: ModelCategory.Men, tone: "wine", image: "/images/categories/men.jpeg" },
]);
</script>

<style scoped>
.category-list {
  display: grid;
  gap: 20px;
  padding: 12px 0 24px;
}

.category-card {
  margin: 0;
  border: 1px solid color-mix(in srgb, var(--card-accent) 28%, transparent);
  --background: var(--card-background);
  background: var(--card-background);
  box-shadow: 0 5px 14px rgba(109, 15, 47, 0.1);
}

.category-card--rose {
  --card-accent: var(--ion-color-secondary);
  --card-background: #fae9ec;
}

.category-card--sand {
  --card-accent: var(--ion-color-tertiary);
  --card-background: #fff0e4;
}

.category-card--wine {
  --card-accent: var(--ion-color-primary);
  --card-background: #f8e9ed;
}

.category-card__content {
  display: grid;
  direction: ltr;
  grid-template-areas: "image title arrow";
  grid-template-columns: 132px 1fr 40px;
  align-items: center;
  gap: 14px;
  min-height: 170px;
  padding: 14px;
}

.category-card__image {
  grid-area: image;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  object-fit: cover;
}

.category-card__title {
  grid-area: title;
  color: var(--card-accent);
  font-size: 20px;
  line-height: 1.55;
  text-align: center;
  unicode-bidi: plaintext;
}

.category-card__arrow {
  grid-area: arrow;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  background: var(--card-accent);
}

.category-card__arrow svg {
  width: 24px;
  height: 24px;
}

@media (max-width: 390px) {
  .category-card__content {
    grid-template-columns: 108px 1fr 36px;
    gap: 10px;
    min-height: 148px;
    padding: 12px;
  }

  .category-card__image {
    width: 108px;
    height: 108px;
  }

  .category-card__title {
    font-size: 17px;
  }

  .category-card__arrow {
    width: 36px;
    height: 36px;
  }
}
</style>
