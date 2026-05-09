<template>
  <IonPage>
    <MainHeader />
    <IonContent>
      <div
        class="ion-padding text-white bg-linear-to-br from-primary via-secondary to-tertiary shadow-lg rounded-b-4xl"
      >
        <h3 class="text-2xl font-bold mb-4">{{ $t("tailor.dashboard.title") }}</h3>
        <div v-if="isLoading" class="flex justify-center py-4">
          <IonSpinner name="crescent" color="light" />
        </div>
        <StatsGrid
          v-else
          :pending-count="pendingPickups.length"
          :in-progress-count="activeOrdersCount"
          :done-count="0"
        />
      </div>

      <div class="mt-4">
        <h2 class="px-4 py-2 font-bold flex items-center justify-between">
          <span>
            {{ $t("customer.dashboard.recentOrders") }}
            <span
              v-if="pendingPickups.length > 0"
              class="ms-2 px-2 py-0.5 rounded-full bg-tertiary text-xs text-tertiary-contrast animate-pulse"
            >
              {{ pendingPickups.length }}
            </span>
          </span>
          <RouterLink
            to="/courier/orders"
            class="text-primary text-sm font-semibold no-underline"
          >
            {{ $t("orderStatus.all") }}
          </RouterLink>
        </h2>

        <div v-if="isLoading" class="flex justify-center py-10">
          <IonSpinner name="crescent" />
        </div>
        <div v-else-if="pendingPickups.length === 0" class="text-center py-10 text-muted-foreground bg-gray-50 mx-4 rounded-2xl">
          <p>{{ $t("courier.dashboard.noPendingPickups") }}</p>
        </div>
        <div v-else class="px-2 space-y-2">
          <OrderListItem
            v-for="order in pendingPickups.slice(0, 5)"
            :key="order.id"
            :reference="order.reference"
            :date="order.date"
            :total-price="order.totalPrice"
            :status="order.status"
            @click="goToOrder(order.id)"
          />
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { MainHeader, StatsGrid, OrderListItem } from "@/components";
import {
  IonPage,
  IonContent,
  IonSpinner,
} from "@ionic/vue";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores";
import { apiClient } from "@/integration/api";
import { DisplayOrderDTO, ORDER_STATUS } from "@/integration/dtos";

const router = useRouter();
const authStore = useAuthStore();
const orders = ref<DisplayOrderDTO[]>([]);
const isLoading = ref(true);

const pendingPickups = computed(() => 
  orders.value.filter(o => 
    o.status === ORDER_STATUS.WAITING_FOR_COURIER_ASSIGNMENT || 
    o.status === ORDER_STATUS.WAITING_FOR_RETURN_COURIER_ASSIGNMENT
  )
);

const activeOrdersCount = computed(() => 
  orders.value.filter(o => 
    o.status === ORDER_STATUS.WAITING_FOR_PICKUP_FROM_CUSTOMER ||
    o.status === ORDER_STATUS.WAITING_FOR_DROPOFF_TO_TAILOR ||
    o.status === ORDER_STATUS.WAITING_FOR_PICKUP_FROM_TAILOR ||
    o.status === ORDER_STATUS.WAITING_FOR_DROPOFF_TO_CUSTOMER
  ).length
);

async function fetchOrders() {
  if (!authStore.userId) return;
  isLoading.value = true;
  try {
    const { data } = await apiClient.courierControllerGetOrders(authStore.userId);
    orders.value = data;
  } catch (error) {
    console.error("Failed to fetch courier orders", error);
  } finally {
    isLoading.value = false;
  }
}

function goToOrder(id: string) {
  router.push(`/courier/orders/${id}`);
}

onMounted(fetchOrders);
</script>
