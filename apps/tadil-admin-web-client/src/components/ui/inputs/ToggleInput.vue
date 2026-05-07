<template>
  <label
    class="relative block h-4 w-8 rounded-full bg-gray-300 transition-colors has-checked:bg-primary"
  >
    <input type="checkbox" v-model="isChecked" class="peer sr-only" />

    <span
      class="absolute inset-y-0 start-0 m-0.5 size-3 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-4"
    />
  </label>
</template>

<script setup lang="ts">
const isChecked = defineModel<boolean>({ required: true });
</script>
