<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet></IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="dashboard" href="/courier/dashboard">
          <LayoutDashboard />
          <IonLabel>{{ $t("tailor.navBar.dashboard") }}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="orders" href="/courier/orders">
          <ClipboardList />
          <IonLabel>{{ $t("tailor.navBar.orders") }}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="wallet" href="/courier/wallet">
          <Wallet />
          <IonLabel>{{ $t("tailor.navBar.wallet") }}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="profile" href="/profile-settings">
          <User />
          <IonLabel>{{ $t("profileSettings.title") }}</IonLabel>
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
import { ClipboardList, LayoutDashboard, Wallet, User } from "lucide-vue-next";
</script>
