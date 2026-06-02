<template>
  <div
    class="w-60 bg-sidebar border-r border-sidebar-border transition-[width] ease-linear duration-200 flex flex-col justify-between"
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

    <div class="p-2 border-t border-sidebar-border">
      <button
        @click="handleLogout"
        class="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm cursor-pointer overflow-hidden whitespace-nowrap hover:bg-red-100 hover:text-red-600 text-sidebar-foreground transition-colors"
      >
        <LogOut class="h-5 w-5" />
        <p>{{ t('nav.logout') }}</p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ClipboardList,
  GitBranchPlus,
  HandCoins,
  KeyRound,
  ScissorsLineDashed,
  Spool,
  Truck,
  Scissors,
  LogOut
} from "lucide-vue-next";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import keycloak from "../integration/keycloak";

const { t } = useI18n();
const navItems = computed(() => [
  { path: "/required-informations", label: t("nav.informations"), icon: Spool },
  { path: "/alterations", label: t("nav.alterations"), icon: HandCoins },
  { path: "/extras", label: t("nav.extras"), icon: GitBranchPlus },
  { path: "/models", label: t("nav.models"), icon: ScissorsLineDashed },
  { path: "/tailors", label: t("nav.tailors"), icon: Scissors },
  { path: "/couriers", label: t("nav.couriers"), icon: Truck },
  { path: "/login-requests", label: t("nav.loginRequests"), icon: KeyRound },
  { path: "/payout-requests", label: t("nav.payoutRequests"), icon: HandCoins },
  { path: "/orders", label: t("nav.orders"), icon: ClipboardList },
]);

const handleLogout = () => {
  keycloak.logout();
};
</script>
