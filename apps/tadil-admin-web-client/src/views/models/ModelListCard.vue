<template>
  <div
    class="relative flex flex-col justify-between border border-border rounded-lg overflow-hidden"
  >
    <div class="h-40 flex justify-center items-center">
      <img
        v-if="model.thumbNailImageBase64String"
        :src="model.thumbNailImageBase64String"
        :alt="model.englishName"
        class="max-h-40 w-auto"
      />
      <Image v-else class="h-10 w-10 opacity-30" />
    </div>
    <div class="flex justify-between w-full p-1 bg-muted">
      <p class="bg-muted text-lg font-semibold">
        {{ translatedName }}
      </p>
      <div class="flex">
        <Button variant="outline" size="icon-sm" @click="emit('select:model')">
          <Edit class="h-4 w-4" />
        </Button>
        <ModelMobilePreview :model="model" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTranslatedNamesComposable } from "@/composables";
import type { DisplayModelDTO } from "@/integration";
import { Image, Edit } from "lucide-vue-next";
import { computed } from "vue";
import ModelMobilePreview from "./mobilePreview/ModelMobilePreview.vue";
import { Button } from "@/components";

const emit = defineEmits<{
  (e: "select:model"): void;
}>();
const props = defineProps<{
  model: DisplayModelDTO;
}>();
const translatedName = computed(
  () => useTranslatedNamesComposable(props.model).translatedName.value
);
</script>
