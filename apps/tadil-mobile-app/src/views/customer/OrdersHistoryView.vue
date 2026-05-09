<template>
  <IonPage>
    <IonHeader class="ion-no-border">
      <SecondaryHeader
        :title="$t('customer.ordersHistory.title')"
        :subtitle="$t('customer.ordersHistory.subtitle')"
        default-href="/customer/dashboard"
      />
      <div class="px-4 pb-4">
        <IonSearchbar
          class="custom-searchbar"
          :placeholder="$t('customer.ordersHistory.search')"
          v-model="searchFilter"
        />

        <div class="flex gap-2 overflow-x-auto scrollbar-hide py-2">
          <IonChip
            v-for="status in orderStatus"
            :key="status"
            :outline="selectedStatus !== status"
            :color="selectedStatus === status ? 'primary' : ''"
            @click="selectedStatus = status"
            class="transition-all"
          >
            <IonLabel>{{ $t(`orderStatus.${status}`) }}</IonLabel>
          </IonChip>
        </div>
      </div>
    </IonHeader>

    <IonContent class="ion-padding">
      <div v-if="isLoading" class="flex justify-center py-20">
        <IonSpinner name="crescent" />
      </div>
      <div v-else-if="filteredOrders.length === 0" class="text-center py-20 text-muted-foreground">
        <Package class="mx-auto w-12 h-12 mb-2 opacity-20" />
        <p>{{ $t("customer.ordersHistory.noOrders") }}</p>
      </div>
      <div v-else class="space-y-4">
        <OrderListItem
          v-for="order in filteredOrders"
          :key="order.reference"
          :reference="order.reference"
          :date="order.date"
          :total-price="order.totalPrice"
          :status="order.status"
          @click="router.push({ name: 'customer-order-details', params: { orderId: order.reference } })"
        />
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonChip,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonSearchbar,
  IonSpinner,
} from "@ionic/vue";
import { computed, ref, onMounted } from "vue";
import { ORDER_STATUS } from "@/integration/dtos";
import { useCustomerOrders } from "./composables/useCustomerOrders.composable";
import { SecondaryHeader, OrderListItem } from "@/components";
import { Package } from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();
const { orders, isLoading, fetchOrders } = useCustomerOrders();

const searchFilter = ref("");
const orderStatus = [
  "all",
  ORDER_STATUS.PENDING,
  ORDER_STATUS.IN_PROGRESS,
  ORDER_STATUS.DONE,
];
const selectedStatus = ref("all");

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    const matchesSearch = order.reference
      .toLowerCase()
      .includes(searchFilter.value.toLowerCase());
    const matchesStatus =
      selectedStatus.value === "all" || order.status === selectedStatus.value;
    return matchesSearch && matchesStatus;
  });
});

onMounted(() => {
  fetchOrders();
});
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
