<template>
  <IonPage>
    <MainHeader />
    <IonContent>
      <div
        class="ion-padding text-white bg-linear-to-br from-primary via-secondary to-tertiary shadow-lg"
      >
        <h3 class="text-2xl font-bold mb-4">{{ $t("tailor.dashboard.title") }}</h3>
        <StatsGrid
          :pending-count="pendingOrders.length"
          :in-progress-count="inProgressOrders.length"
          :completed-count="completedOrders.length"
          :waiting-for-pickup-count="waitingForPickupOrders.length"
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
} from "@ionic/vue";
import { useOrders } from "./composables/useOrders.composable";
import MainHeader from "@/components/MainHeader.vue";
import { StatsGrid, OrderListItem } from "@/components";
import { useRouter } from "vue-router";

const {
  pendingOrders,
  inProgressOrders,
  completedOrders,
  waitingForPickupOrders,
} = useOrders();

const router = useRouter();
</script>
