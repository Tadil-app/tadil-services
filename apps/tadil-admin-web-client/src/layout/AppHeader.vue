<template>
  <div
    class="h-12 flex rtl:flex-row-reverse justify-between items-center border-b border-border bg-background px-4 z-50"
  >
    <div>
      <h1 class="text-xl font-bold text-sidebar-foreground">Tadil-تعديل</h1>
    </div>
    <div>
      <LocalesToggle />
    </div>
  </div>
</template>

<script setup lang="ts">
import LocalesToggle from "@/components/LocalesToggle.vue";
</script>
