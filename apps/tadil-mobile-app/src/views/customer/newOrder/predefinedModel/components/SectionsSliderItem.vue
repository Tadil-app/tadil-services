<template>
  <button
    :class="{
      selected: selectedSection,
    }"
    @click="selectSection(section)"
  >
    <Check v-if="selectedSection" class="w-4 h-4 rounded-full" />
    <TranslatedName :names="section" />
    <p
      v-if="selectedSection"
      class="flex items-center justify-center text-xs w-4 h-4 bg-tertiary-contrast text-tertiary rounded-full"
    >
      {{ selectedSection.alterations.length }}
    </p>
  </button>
</template>

<script setup lang="ts">
import { DisplaySectionDTO } from "@/integration/dtos";
import { usePredefinedModel } from "../usePredefinedModel.composable";
import { computed } from "vue";
import { TranslatedName } from "@/components";
import { Check } from "lucide-vue-next";

const props = defineProps<{
  section: DisplaySectionDTO;
}>();

const { modelItems, selectSection } = usePredefinedModel();
const modelSelectedSections = computed(
  () => modelItems.value?.modelImages.flatMap((image) => image.sections) || [],
);
const selectedSection = computed(() =>
  modelSelectedSections.value.find((s) => s.sectionId === props.section.id),
);
</script>

<style scoped>
@reference '@/theme/tailwind.css';

button {
  @apply flex items-center px-4 py-1 rounded-full whitespace-nowrap transition-colors bg-secondary/60;
}
button.selected {
  @apply bg-tertiary text-tertiary-contrast px-2 py-1;
}
</style>
