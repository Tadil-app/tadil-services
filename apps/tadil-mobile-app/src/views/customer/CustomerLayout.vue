<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet />
      <IonTabBar
        v-show="isTabsVisible"
        slot="bottom"
        class="flex rtl:flex-row-reverse"
      >
        <IonTabButton tab="dashboard" href="/customer/dashboard">
          <House />
          <IonLabel class="text-xs">
            {{ $t("tailor.navBar.dashboard") }}
          </IonLabel>
        </IonTabButton>
        <IonTabButton tab="new-order" href="/customer/new-order">
          <PackagePlus />
          <IonLabel class="text-xs">{{ $t("tailor.navBar.orders") }}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="cart" href="/customer/cart">
          <ShoppingBag />
          <IonLabel class="text-xs">{{ $t("cart.title") }}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonPage,
} from "@ionic/vue";
import { House, PackagePlus, ShoppingBag } from "lucide-vue-next";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isTabsVisible = computed(() => {
  return (
    route.name !== "customer-new-order-predefined-model-gallery" &&
    route.name !== "customer-new-order-custom-upload"
  );
});
</script>
