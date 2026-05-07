<template>
  <div
    class="w-60 bg-sidebar border-r border-sidebar-border transition-[width] ease-linear duration-200"
  >
    <div class="space-y-2 p-2">
      <RouterLink
        v-for="navItem in navItems"
        :key="navItem.path"
        :to="navItem.path"
        class="flex items-center gap-2 rounded-md p-2 text-left text-sm cursor-pointer overflow-hidden whitespace-nowrap hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        exact-active-class="bg-sidebar-accent text-sidebar-accent-foreground"
      >
        <component :is="navItem.icon" class="h-5 w-5" />
        <p>{{ navItem.label }}</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  GitBranchPlus,
  HandCoins,
  KeyRound,
  ScissorsLineDashed,
  Spool,
  Users,
} from "lucide-vue-next";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const navItems = computed(() => [
  { path: "/required-informations", label: t("nav.informations"), icon: Spool },
  { path: "/alterations", label: t("nav.alterations"), icon: HandCoins },
  { path: "/extras", label: t("nav.extras"), icon: GitBranchPlus },
  { path: "/models", label: t("nav.models"), icon: ScissorsLineDashed },
  { path: "/users", label: t("nav.users"), icon: Users },
  { path: "/login-requests", label: t("nav.loginRequests"), icon: KeyRound },
]);
</script>
