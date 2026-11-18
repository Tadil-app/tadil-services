<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet />
      <IonTabBar slot="bottom" class="flex">
        <IonTabButton tab="dashboard" href="/tailor/dashboard">
          <House />
          <IonLabel>{{ $t('tailor.navBar.dashboard') }}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="orders" href="/tailor/orders">
          <PackageSearch />
          <IonLabel>{{ $t('tailor.navBar.orders') }}</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="wallet" href="/tailor/wallet">
          <Wallet />
          <IonLabel>{{ $t('tailor.navBar.wallet') }}</IonLabel>
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
} from '@ionic/vue';
import { useTailorOrdersStore } from '@/stores';
import { onBeforeMount, onUnmounted } from 'vue';
import { onOrderPush } from '@/push/pushNotifications';
import { House, PackageSearch, Wallet } from 'lucide-vue-next';

const ordersStore = useTailorOrdersStore();
const { fetchOrders } = ordersStore;

onBeforeMount(() => {
  fetchOrders();
});

// An order alert arrived while the app is open: show the order right away.
const stopOrderPush = onOrderPush(() => fetchOrders());
onUnmounted(stopOrderPush);
</script>
