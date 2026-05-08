<template>
  <IonPage>
    <MainHeader :title="$t('tailor.dashboard.title')" />
    <IonContent class="ion-padding">
      <div class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-2 gap-4">
          <IonCard class="m-0 ion-padding text-center">
            <IonLabel class="text-xs text-muted-foreground block mb-1">
              {{ $t('tailor.wallet.income') }}
            </IonLabel>
            <p class="text-xl font-bold">0 {{ $t('common.currencies.sar') }}</p>
          </IonCard>
          <IonCard class="m-0 ion-padding text-center">
            <IonLabel class="text-xs text-muted-foreground block mb-1">
              {{ $t('tailor.navBar.orders') }}
            </IonLabel>
            <p class="text-xl font-bold">{{ activeOrdersCount }}</p>
          </IonCard>
        </div>

        <!-- Pending Pickups Section -->
        <div>
          <h2 class="text-lg font-bold mb-3">{{ $t('customer.dashboard.recentOrders') }}</h2>
          <div v-if="isLoading" class="flex justify-center py-10">
            <IonSpinner name="crescent" />
          </div>
          <div v-else-if="pendingPickups.length === 0" class="text-center py-10 text-muted-foreground">
            <p>No pending pickups available</p>
          </div>
          <div v-else class="space-y-4">
            <IonCard
              v-for="order in pendingPickups"
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
              <div class="mt-3 flex justify-between items-center">
                <p class="text-sm font-semibold">{{ order.totalPrice }} SAR</p>
                <IonButton size="small" fill="clear">
                  View Details
                </IonButton>
              </div>
            </IonCard>
          </div>
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
  IonLabel,
  IonSpinner,
  IonBadge,
  IonButton,
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString();
}

function getStatusLabel(status: string) {
  if (status === ORDER_STATUS.WAITING_FOR_COURIER_ASSIGNMENT) return "New Assignment";
  if (status === ORDER_STATUS.WAITING_FOR_RETURN_COURIER_ASSIGNMENT) return "Return Trip";
  return status;
}

function getStatusColor(status: string) {
  if (status === ORDER_STATUS.WAITING_FOR_COURIER_ASSIGNMENT || status === ORDER_STATUS.WAITING_FOR_RETURN_COURIER_ASSIGNMENT) return "warning";
  return "primary";
}

onMounted(fetchOrders);
</script>
