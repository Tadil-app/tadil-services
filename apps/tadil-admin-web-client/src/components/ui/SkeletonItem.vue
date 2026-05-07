<template>
  <div
    class="animate-pulse bg-muted"
    :class="{
      'h-4 w-24 rounded-md': variant === 'default',
      'h-4 w-32 rounded-md': variant === 'long-text',
      'h-4 w-20 rounded-md': variant === 'short-text',
      'h-6 w-16 rounded-full': variant === 'badge',
      'h-8 w-8 rounded-full': variant === 'action-button',
      'h-full w-full rounded-md': variant === 'card',
    }"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?:
      | "default"
      | "long-text"
      | "short-text"
      | "badge"
      | "action-button"
      | "card";
  }>(),
  {
    variant: "default",
  }
);
</script>
