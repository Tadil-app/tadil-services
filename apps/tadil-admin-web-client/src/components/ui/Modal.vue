<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-black/80 h-full w-full flex items-center justify-center"
  >
    <div
      class="relative p-4 max-w-[80vw] max-h-[80vh] bg-background rounded-lg overflow-auto"
      :class="$attrs.class"
    >
      <div
        class="absolute right-1 top-1 cursor-pointer rounded-sm p-1 text-sm flex items-center justify-center opacity-70 transition-opacity hover:opacity-100 bg-accent text-muted-foreground"
        @click="closeModal"
      >
        <X class="h-4 w-4" />
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { X } from "lucide-vue-next";

const isOpen = defineModel<boolean>();
const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

function closeModal() {
  emit("closeModal");
  isOpen.value = false;
}
</script>
