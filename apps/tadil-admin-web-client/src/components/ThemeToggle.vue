<template>
  <Button
    variant="ghost"
    size="icon"
    :title="theme === 'dark' ? $t('common.theme.light') : $t('common.theme.dark')"
    :aria-label="theme === 'dark' ? $t('common.theme.light') : $t('common.theme.dark')"
    @click="toggleTheme"
  >
    <Transition name="theme-icon" mode="out-in">
      <Moon v-if="theme === 'light'" key="moon" class="h-5 w-5" />
      <Sun v-else key="sun" class="h-5 w-5" />
    </Transition>
  </Button>
</template>

<script setup lang="ts">
import { Moon, Sun } from "lucide-vue-next";
import { Button } from "./ui";
import { useTheme } from "@/composables";

const { theme, toggleTheme } = useTheme();
</script>

<style scoped>
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
}
.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.6);
}
</style>
