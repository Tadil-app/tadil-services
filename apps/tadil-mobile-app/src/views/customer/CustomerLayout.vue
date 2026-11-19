<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet />
      <IonTabBar v-show="isTabsVisible" slot="bottom" class="flex">
        <IonTabButton tab="dashboard" href="/customer/dashboard" :class="{ 'opacity-50': !authStore.token }">
          <House />
          <IonLabel class="text-xs">
            {{ $t("tailor.navBar.dashboard") }}
          </IonLabel>
        </IonTabButton>

        <IonTabButton tab="new-order" href="/customer/new-order/category-selection">
          <PackagePlus />
          <IonLabel class="text-xs">{{ $t("tailor.navBar.orders") }}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="cart" href="/customer/cart">
          <div class="relative">
            <ShoppingBag />
            <IonBadge v-if="cartStore.itemsCount > 0" color="secondary" class="absolute -top-1 -right-1.5 px-1 min-w-4.5 h-4.5 flex items-center justify-center text-[10px] rounded-full">
              {{ cartStore.itemsCount }}
            </IonBadge>
          </div>
          <IonLabel class="text-xs">{{ $t("cart.title") }}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
</template>

<script setup lang="ts">
import { IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonLabel, IonPage, IonBadge } from "@ionic/vue";
import { House, PackagePlus, ShoppingBag } from "lucide-vue-next";
import { computed, nextTick, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useCartStore, useAuthStore } from "@/stores";
import { unlockIonicTabBar } from "@/utils";

const HIDDEN_TAB_ROUTES = new Set([
  "customer-new-order-predefined-model-gallery",
  "customer-new-order-custom-upload",
]);

const cartStore = useCartStore();
const authStore = useAuthStore();
const route = useRoute();
const isTabsVisible = computed(() => !HIDDEN_TAB_ROUTES.has(String(route.name)));

let revealTimer: ReturnType<typeof window.setTimeout> | undefined;
let visibilityTimer: ReturnType<typeof window.setTimeout> | undefined;

function scheduleUnlock() {
  window.clearTimeout(revealTimer);
  revealTimer = window.setTimeout(() => {
    if (isTabsVisible.value) unlockIonicTabBar();
  }, 80);
}

async function revealTabBar() {
  if (!isTabsVisible.value) return;
  await nextTick();
  unlockIonicTabBar();
  scheduleUnlock();
}

watch(isTabsVisible, (visible) => {
  if (visible) void revealTabBar();
});

function onDocumentVisible() {
  if (document.visibilityState !== "visible") return;
  window.clearTimeout(visibilityTimer);
  visibilityTimer = window.setTimeout(() => {
    if (isTabsVisible.value) unlockIonicTabBar();
  }, 80);
}

onMounted(() => {
  document.addEventListener("visibilitychange", onDocumentVisible);
});

onUnmounted(() => {
  document.removeEventListener("visibilitychange", onDocumentVisible);
  window.clearTimeout(revealTimer);
  window.clearTimeout(visibilityTimer);
});
</script>

<style scoped>
ion-tab-bar {
  --background: rgba(255, 253, 251, 0.96);
  border-top: 1px solid #f1e5e2;
  min-height: 64px;
}

ion-tab-button {
  --color: #999792;
  --color-selected: var(--ion-color-primary);
  font-weight: 600;
}

ion-tab-button svg {
  width: 25px;
  height: 25px;
}
</style>
