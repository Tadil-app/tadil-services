<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet />
      <IonTabBar slot="bottom" class="flex rtl:flex-row-reverse">
        <IonTabButton tab="dashboard" href="/courier/dashboard">
          <House />
          <IonLabel>{{ $t("tailor.navBar.dashboard") }}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="orders" href="/courier/orders">
          <PackageSearch />
          <IonLabel>{{ $t("tailor.navBar.orders") }}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="wallet" href="/courier/wallet">
          <Wallet />
          <IonLabel>{{ $t("tailor.navBar.wallet") }}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/vue";
import { PackageSearch, House, Wallet } from "lucide-vue-next";
</script>
