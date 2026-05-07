<template>
  <IonPage>
    <SecondaryHeader
      :title="$t('modelCategory.title')"
      :showBackButton="false"
    />
    <IonContent class="ion-padding">
      <IonCard
        v-for="category in categories"
        :key="category.value"
        :button="true"
        :color="category.color"
        class="my-6"
        :router-link="{
          name: 'customer-new-order-model-type-selection',
          params: { category: category.value },
        }"
        @click="selectedCategory = category.value"
      >
        <span
          class="w-full h-full flex flex-col justify-center items-center p-6 gap-3 text-white"
        >
          <component :is="category.icon" class="w-12 h-12" />
          <p class="text-2xl font-semibold">
            {{ $t(`modelCategory.${category.value}`) }}
          </p>
        </span>
      </IonCard>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ModelCategory } from "@/integration/dtos";
import { IonPage, IonContent, IonCard } from "@ionic/vue";
import { CircleUser, Users, Baby } from "lucide-vue-next";
import { computed } from "vue";
import { SecondaryHeader } from "@/components";

const selectedCategory = defineModel<ModelCategory>();
const categories = computed(() => [
  {
    value: ModelCategory.Men,
    color: "primary",
    icon: CircleUser,
  },
  {
    value: ModelCategory.Women,
    color: "secondary",
    icon: Users,
  },
  {
    value: ModelCategory.Kids,
    color: "tertiary",
    icon: Baby,
  },
]);
</script>
