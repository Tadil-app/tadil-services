<template>
  <header
    class="h-14 flex rtl:flex-row-reverse justify-between items-center border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sticky top-0 z-50"
  >
    <div class="flex items-center gap-2">
      <img
        src="/logo.png"
        alt="Tadil"
        class="h-10 w-auto select-none"
        draggable="false"
      />
    </div>
    <div class="flex items-center gap-1">
      <ThemeToggle />
      <LocalesToggle />
    </div>
  </header>
</template>

<script setup lang="ts">
import LocalesToggle from "@/components/LocalesToggle.vue";
import { ThemeToggle } from "@/components";
</script>
