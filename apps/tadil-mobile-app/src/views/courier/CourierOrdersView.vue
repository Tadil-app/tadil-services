<template>
  <IonPage>
    <IonHeader class="ion-no-border">
      <SecondaryHeader
        :title="$t('tailor.orders.title')"
        :subtitle="$t('tailor.orders.subtitle')"
        :show-back-button="false"
      />
      <div class="px-4 pb-2 bg-background">
        <IonSearchbar
          show-clear-button="always"
          :placeholder="$t('tailor.orders.search')"
          v-model="searchQuery"
          class="custom-searchbar"
        />
        
        <div class="flex overflow-x-auto pb-2 scrollbar-hide">
          <div
            v-for="status in orderStatuses"
            :key="status"
            class="mx-1 px-4 py-2 text-sm rounded-xl border border-medium/20 text-medium whitespace-nowrap transition-colors active:scale-95"
            :class="{
              'bg-primary text-primary-contrast border-primary shadow-sm': status === selectedStatus,
            }"
            @click="selectedStatus = status"
          >
            {{ status === 'all' ? $t('orderStatus.all') : $t('orderStatus.' + status) }}
          </div>
        </div>
      </div>
    </IonHeader>

    <IonContent>
      <IonRefresher slot="fixed" @ion-refresh="handleRefresh">
        <IonRefresherContent refreshing-spinner="bubbles" />
      </IonRefresher>

      <div v-if="isLoading" class="flex justify-center py-20">
        <IonSpinner name="crescent" />
      </div>
      
      <div v-else-if="filteredOrders.length === 0" class="text-center py-20 text-muted-foreground bg-gray-50 mx-4 rounded-2xl mt-4">
        <p>{{ $t("courier.orders.noOrders") }}</p>
      </div>

      <div v-else class="px-2 space-y-2 mt-2">
        <OrderListItem
          v-for="order in filteredOrders"
          :key="order.id"
          :reference="order.reference"
          :date="order.date"
          :total-price="order.totalPrice"
          :status="order.status"
          @click="goToOrder(order.id)"
        />
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { SecondaryHeader, OrderListItem } from "@/components";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonSpinner,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
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
const selectedStatus = ref("all");

const orderStatuses = [
  "all",
  ORDER_STATUS.WAITING_FOR_COURIER_ASSIGNMENT,
  ORDER_STATUS.WAITING_FOR_PICKUP_FROM_CUSTOMER,
  ORDER_STATUS.WAITING_FOR_DROPOFF_TO_TAILOR,
  ORDER_STATUS.WAITING_FOR_RETURN_COURIER_ASSIGNMENT,
  ORDER_STATUS.WAITING_FOR_PICKUP_FROM_TAILOR,
  ORDER_STATUS.WAITING_FOR_DROPOFF_TO_CUSTOMER,
  ORDER_STATUS.DONE
];

const filteredOrders = computed(() => {
  let list = orders.value;
  
  if (selectedStatus.value !== "all") {
    list = list.filter(o => o.status === selectedStatus.value);
  }
  
  if (searchQuery.value) {
    list = list.filter(o => o.reference.toLowerCase().includes(searchQuery.value.toLowerCase()));
  }
  
  return list;
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

async function handleRefresh(event: any) {
  await fetchOrders();
  event.target.complete();
}

function goToOrder(id: string) {
  router.push(`/courier/orders/${id}`);
}

onMounted(fetchOrders);
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
