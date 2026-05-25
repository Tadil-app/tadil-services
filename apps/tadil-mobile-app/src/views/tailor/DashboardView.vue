<template>
  <IonPage>
    <MainHeader />
    <IonContent>
      <IonRefresher slot="fixed" @ion-refresh="fetchOrders">
        <IonRefresherContent refreshing-spinner="bubbles" />
      </IonRefresher>
      <div
        class="ion-padding text-white bg-linear-to-br from-primary via-secondary to-tertiary shadow-lg"
      >
        <h3 class="text-2xl font-bold mb-4">{{ $t("tailor.dashboard.title") }}</h3>
        <StatsGrid
          :stats="[
            {
              label: 'waitingForTailorAssignement',
              count: pendingOrders.length,
            },
            { label: 'inProgress', count: inProgressOrders.length },
            { label: 'done', count: doneOrders.length },
          ]"
        />
      </div>
      <div>
        <h2 class="px-4 py-2 font-bold">
          {{ $t("orderStatus.pending") }}
          <span
            class="px-2 rounded-full bg-tertiary text-sm text-tertiary-contrast"
            :class="{ ' animate-pulse': pendingOrders.length > 0 }"
          >
            {{ pendingOrders.length }}
          </span>
        </h2>
        <div class="px-2 space-y-2">
          <OrderListItem
            v-for="order in pendingOrders"
            :key="order.reference"
            :reference="order.reference"
            :date="order.date"
            :total-price="order.totalPrice"
            :status="order.status"
            @click="router.push({
              name: 'tailor-orders-details',
              params: { orderId: order.reference },
            })"
          />
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  onIonViewWillEnter,
} from "@ionic/vue";
import { useTailorOrdersStore } from "@/stores";
import MainHeader from "@/components/MainHeader.vue";
import { StatsGrid, OrderListItem } from "@/components";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const router = useRouter();
const ordersStore = useTailorOrdersStore();
const {
  pendingOrders,
  inProgressOrders,
  doneOrders,
} = storeToRefs(ordersStore);
const { fetchOrders } = ordersStore;

onIonViewWillEnter(() => {
  fetchOrders();
});
</script>
