<template>
  <IonFooter v-if="totalAlterationsCount > 0" class="divide-y divide-medium/50 bg-background border-t border-primary/10">
    <!-- Expansion Toggle -->
    <div
      v-if="showExpand"
      class="p-1 flex gap-2 justify-center items-center cursor-pointer hover:bg-medium/5 transition-colors"
      @click="isDetailsExpanded = !isDetailsExpanded"
    >
      <p class="text-sm font-medium">
        {{ isDetailsExpanded ? $t("cart.hideDetails") : $t("cart.showDetails") }}
      </p>
      <ChevronDown v-if="isDetailsExpanded" class="w-4 h-4" />
      <ChevronUp v-else class="w-4 h-4" />
    </div>

    <!-- Scrollable Details List -->
    <div
      v-if="isDetailsExpanded"
      class="max-h-[40vh] overflow-y-auto bg-background p-4 space-y-4 animate-in slide-in-from-bottom-2 duration-200"
    >
      <slot name="items"></slot>
    </div>

    <!-- Main Footer Bar -->
    <div class="p-4 flex items-center justify-between">
      <div class="min-w-0">
        <p class="text-medium text-xs font-medium uppercase tracking-wider">
          {{ $t("cart.alterations") }}: {{ totalAlterationsCount }}
        </p>
        <p class="text-2xl text-tertiary font-extrabold truncate">
          {{ totalPrice }} {{ $t("common.currencies.sar") }}
        </p>
      </div>
      <div class="shrink-0 ms-4">
        <slot></slot>
      </div>
    </div>
  </IonFooter>
</template>

<script setup lang="ts">
import { IonFooter } from "@ionic/vue";
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import { ref } from "vue";

withDefaults(defineProps<{
  totalAlterationsCount: number;
  totalPrice: number;
  showExpand?: boolean;
}>(), {
  showExpand: true
});

const isDetailsExpanded = ref(false);
</script>
