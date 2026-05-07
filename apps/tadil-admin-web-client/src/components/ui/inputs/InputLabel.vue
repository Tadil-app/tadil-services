<template>
  <label
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    v-bind="props"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  for?: string;
}>();
</script>
