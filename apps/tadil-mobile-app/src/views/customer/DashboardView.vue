<template>
  <IonPage>
    <MainHeader />
    <IonContent>
      <div
        class="ion-padding text-white bg-linear-to-br from-primary via-secondary to-tertiary shadow-lg rounded-b-4xl"
      >
        <h3 class="text-2xl font-bold mb-4">
          {{ $t("customer.dashboard.title") }}
        </h3>
        <StatsGrid
          :pending-count="pendingOrders.length"
          :in-progress-count="inProgressOrders.length"
          :done-count="doneOrders.length"
        />
      </div>

      <div class="ion-padding mt-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">
            {{ $t("customer.dashboard.recentOrders") }}
          </h2>
          <RouterLink
            :to="{ name: 'customer-orders-history' }"
            class="text-primary text-sm font-semibold no-underline"
          >
            {{ $t("orderStatus.all") }}
          </RouterLink>
        </div>

        <div class="space-y-4">
          <OrderListItem
            v-for="order in mockOrders"
            :key="order.reference"
            :reference="order.reference"
            :date="order.date"
            :total-price="order.totalPrice"
            :status="order.status"
          />
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import { useCustomerOrders } from "./composables/useCustomerOrders.composable";
import { MainHeader, StatsGrid, OrderListItem } from "@/components";

const {
  mockOrders,
  pendingOrders,
  inProgressOrders,
  doneOrders,
} = useCustomerOrders();
</script>
