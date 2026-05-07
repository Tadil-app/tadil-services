<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet />
      <IonTabBar slot="bottom" class="flex rtl:flex-row-reverse">
        <IonTabButton tab="dashboard" href="/tailor/dashboard">
          <House />
          <IonLabel>{{ $t("tailor.navBar.dashboard") }}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="orders" href="/tailor/orders">
          <PackageSearch />
          <IonLabel>{{ $t("tailor.navBar.orders") }}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="wallet" href="/tailor/wallet">
          <Wallet />
          <IonLabel>{{ $t("tailor.navBar.wallet") }}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonPage,
} from "@ionic/vue";
import { useOrders } from "./composables/useOrders.composable";
import { onBeforeMount } from "vue";
import { House, PackageSearch, Wallet } from "lucide-vue-next";

const { getOrders } = useOrders();

onBeforeMount(() => {
  getOrders();
});
</script>
