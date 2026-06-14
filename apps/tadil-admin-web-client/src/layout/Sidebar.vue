<template>
  <nav
    class="w-60 bg-sidebar text-sidebar-foreground border-e border-sidebar-border flex flex-col justify-between overflow-y-auto"
  >
    <div class="space-y-1 p-3">
      <p
        class="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {{ t("nav.menu") }}
      </p>
      <RouterLink
        v-for="navItem in navItems"
        :key="navItem.path"
        :to="navItem.path"
        class="group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer overflow-hidden whitespace-nowrap text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        active-class="is-active bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
      >
        <span
          class="absolute inset-y-1.5 start-0 w-1 rounded-full bg-sidebar-primary opacity-0 transition-opacity group-[.is-active]:opacity-100"
        />
        <component :is="navItem.icon" class="h-5 w-5 shrink-0" />
        <span class="truncate">{{ navItem.label }}</span>
      </RouterLink>
    </div>

    <div class="p-3 border-t border-sidebar-border">
      <button
        @click="handleLogout"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium cursor-pointer overflow-hidden whitespace-nowrap text-sidebar-foreground/80 transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut class="h-5 w-5 shrink-0" />
        <span class="truncate">{{ t('nav.logout') }}</span>
      </button>
    </div>
  </nav>
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
