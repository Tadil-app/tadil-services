<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet />
      <IonTabBar slot="bottom" class="flex">
        <IonTabButton tab="dashboard" href="/courier/dashboard">
          <House />
          <IonLabel>{{ $t("courier.navBar.dashboard") }}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="orders" href="/courier/orders">
          <Route />
          <IonLabel>{{ $t("courier.navBar.orders") }}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="wallet" href="/courier/wallet">
          <Wallet />
          <IonLabel>{{ $t("courier.navBar.wallet") }}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/vue";
import { Route, House, Wallet } from "lucide-vue-next";
</script>
