<template>
  <div
    class="flex justify-between items-center p-4 rounded-lg border border-border bg-item text-main shadow-sm"
  >
    <div class="flex flex-col min-w-0">
      <div class="flex items-center gap-2 overflow-hidden">
        <!-- Optional Index Circle -->
        <span
          v-if="index !== undefined"
          class="w-6 h-6 shrink-0 rounded-full bg-tertiary text-tertiary-contrast flex items-center justify-center text-xs font-bold"
        >
          {{ index }}
        </span>

        <div class="flex items-center truncate">
          <TranslatedName :names="sectionNames" class="text-lg font-medium" />
          <Dot class="text-tertiary shrink-0" />
          <TranslatedName
            :names="alterationNames"
            class="text-sm text-medium truncate"
          />
        </div>
      </div>

      <!-- Price aligned with text if index exists -->
      <span
        class="text-sm text-tertiary font-semibold"
        :class="index !== undefined ? 'ms-8' : ''"
      >
        {{ price }} {{ $t("common.currencies.sar") }}
      </span>
    </div>

    <!-- Actions -->
    <div class="flex gap-1 shrink-0">
      <IonButton fill="clear" color="secondary" size="small" @click="$emit('edit')">
        <Pencil slot="icon-only" class="w-5 h-5" />
      </IonButton>
      <IonButton fill="clear" color="danger" size="small" @click="$emit('delete')">
        <Trash2 slot="icon-only" class="w-5 h-5" />
      </IonButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonButton } from "@ionic/vue";
import { TranslatedName } from "@/components";
import { Dot, Pencil, Trash2 } from "lucide-vue-next";
import type { TranslatedNameObject } from "@/types/cart.types";

defineProps<{
  sectionNames: TranslatedNameObject;
  alterationNames: TranslatedNameObject;
  price: number;
  index?: number;
}>();

defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
}>();
</script>
