<template>
  <div
    class="relative flex gap-4 p-3 rounded-2xl border border-border bg-item text-main shadow-sm overflow-hidden"
  >
    <!-- Left: Small Segmenter / Image -->
    <div class="w-28 h-28 shrink-0 bg-medium/5 rounded-xl overflow-hidden relative">
      <ImageContainer
        v-if="model.id.startsWith('custom')"
        :imageUrl="imageUrl"
        :alt="section.englishName"
        class="h-full w-full object-cover"
      />
      <ModelSegmenter
        v-else
        :imageUrl="imageUrl"
        :section="section.coordinates"
        :alt="section.englishName"
        class="h-full w-full object-cover"
      />
    </div>

    <!-- Right: Content Column -->
    <div class="flex flex-col grow min-w-0 py-1">
      <div class="space-y-2">
        <TranslatedName :names="model" class="text-xl font-bold truncate" />

        <div class="flex flex-wrap gap-2">
          <span
            class="px-3 py-1 text-xs bg-tertiary text-tertiary-contrast rounded-full font-medium"
          >
            <TranslatedName :names="section" />
          </span>
          <span
            class="px-3 py-1 text-xs bg-secondary text-secondary-contrast rounded-full font-medium"
          >
            <TranslatedName :names="alteration" />
          </span>
        </div>
      </div>

      <!-- Price at the bottom -->
      <div class="mt-auto flex justify-end">
        <span class="text-xl text-tertiary font-extrabold">
          {{ alteration.price }} {{ $t("common.currencies.sar") }}
        </span>
      </div>
    </div>

    <!-- Action Buttons: Top Right -->
    <div class="absolute top-3 end-3 flex flex-col gap-1">
      <IonButton
        fill="clear"
        color="secondary"
        size="small"
        class="h-8 w-8 m-0"
        @click="$emit('edit')"
      >
        <Pencil slot="icon-only" class="w-4 h-4" />
      </IonButton>
      <IonButton
        fill="clear"
        color="danger"
        size="small"
        class="h-8 w-8 m-0"
        @click="$emit('delete')"
      >
        <Trash2 slot="icon-only" class="w-4 h-4" />
      </IonButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonButton } from "@ionic/vue";
import { TranslatedName, ModelSegmenter, ImageContainer } from "@/components";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { SelectedAlteration, SelectedSection } from "@/types/cart.types";
import type { DisplayModelDTO } from "@/integration/dtos";

defineProps<{
  model: DisplayModelDTO;
  imageUrl: string;
  section: SelectedSection;
  alteration: SelectedAlteration;
}>();

defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
}>();
</script>
