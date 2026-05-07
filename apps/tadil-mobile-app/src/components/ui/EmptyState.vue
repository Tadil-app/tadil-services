<template>
  <div
    class="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-80 px-6 animate-in fade-in zoom-in duration-300"
  >
    <div class="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center">
      <component :is="icon" class="w-16 h-16 text-primary" />
    </div>
    
    <div class="space-y-2">
      <h2 class="text-2xl font-bold text-main">{{ title }}</h2>
      <p class="text-medium text-sm leading-relaxed max-w-xs mx-auto">
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.default" class="pt-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Package } from "lucide-vue-next";
import type { Component } from "vue";

withDefaults(defineProps<{
  title: string;
  description: string;
  icon?: Component;
}>(), {
  icon: Package
});
</script>
