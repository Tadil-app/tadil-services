<template>
  <IonPage>
    <MainHeader :title="$t('tailor.orders.title')" />
    <IonContent class="ion-padding">
      <div class="space-y-4">
        <IonSearchbar :placeholder="$t('tailor.orders.search')" v-model="searchQuery" />
        
        <div v-if="isLoading" class="flex justify-center py-10">
          <IonSpinner name="crescent" />
        </div>
        
        <div v-else-if="filteredOrders.length === 0" class="text-center py-10 text-muted-foreground">
          <p>No orders found</p>
        </div>

        <div v-else class="space-y-4">
          <IonCard
            v-for="order in filteredOrders"
            :key="order.id"
            class="m-0 ion-padding"
            @click="goToOrder(order.id)"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">#{{ order.reference }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ formatDate(order.date) }}
                </p>
              </div>
              <IonBadge :color="getStatusColor(order.status)">
                {{ getStatusLabel(order.status) }}
              </IonBadge>
            </div>
            <div class="mt-3">
              <p class="text-sm font-semibold">{{ order.totalPrice }} SAR</p>
            </div>
          </IonCard>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { MainHeader } from "@/components";
import {
  IonPage,
  IonContent,
  IonCard,
  IonSpinner,
  IonBadge,
  IonSearchbar,
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
const searchQuery = ref("");

const filteredOrders = computed(() => {
  if (!searchQuery.value) return orders.value;
  return orders.value.filter(o => o.reference.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString();
}

function getStatusLabel(status: string) {
  return status; // Should use translation or a mapper
}

function getStatusColor(status: string) {
  if (status === ORDER_STATUS.DONE) return "success";
  if (status === ORDER_STATUS.WAITING_FOR_COURIER_ASSIGNMENT || status === ORDER_STATUS.WAITING_FOR_RETURN_COURIER_ASSIGNMENT) return "warning";
  return "primary";
}

onMounted(fetchOrders);
</script>
