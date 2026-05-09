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
        <div v-if="isLoading" class="flex justify-center py-4">
          <IonSpinner name="crescent" color="light" />
        </div>
        <StatsGrid
          v-else
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

        <div v-if="isLoading" class="flex justify-center py-10">
          <IonSpinner name="crescent" />
        </div>
        <div v-else-if="orders.length === 0" class="text-center py-10 text-muted-foreground bg-gray-50 rounded-2xl">
          <p>No orders yet.</p>
        </div>
        <div v-else class="space-y-4">
          <OrderListItem
            v-for="order in recentOrders"
            :key="order.reference"
            :reference="order.reference"
            :date="order.date"
            :total-price="order.totalPrice"
            :status="order.status"
            @click="router.push({ name: 'customer-order-details', params: { orderId: order.reference } })"
          />
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonSpinner } from "@ionic/vue";
import { useCustomerOrders } from "./composables/useCustomerOrders.composable";
import { MainHeader, StatsGrid, OrderListItem } from "@/components";
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const {
  orders,
  pendingOrders,
  inProgressOrders,
  doneOrders,
  isLoading,
  fetchOrders,
} = useCustomerOrders();

const recentOrders = computed(() => orders.value.slice(0, 5));

onMounted(() => {
  fetchOrders();
});
</script>
