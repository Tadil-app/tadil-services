<template>
  <IonPage>
    <IonHeader class="ion-no-border">
      <SecondaryHeader
        :title="$t('customer.ordersHistory.title')"
        :subtitle="$t('customer.ordersHistory.subtitle')"
        default-href="/customer/dashboard"
        :show-back-button="true"
      />
      <div class="px-4 pb-2 bg-background">
        <IonSearchbar
          show-clear-button="always"
          :placeholder="$t('customer.ordersHistory.search')"
          v-model="searchFilter"
        />
        <div class="flex overflow-x-auto pb-2 scrollbar-hide">
          <div
            v-for="status in orderStatus"
            :key="status"
            class="mx-1 px-4 py-2 text-sm rounded-xl border border-medium/20 text-medium whitespace-nowrap transition-colors active:scale-95"
            :class="{
              'bg-primary text-primary-contrast border-primary shadow-sm': status === selectedStatus,
            }"
            @click="selectedStatus = status"
          >
            {{ $t("orderStatus." + status) }}
          </div>
        </div>
      </div>
    </IonHeader>

    <IonContent>
      <div class="px-2 space-y-2 mt-2">
        <OrderListItem
          v-for="order in filteredOrders"
          :key="order.reference"
          :reference="order.reference"
          :date="order.date"
          :total-price="order.totalPrice"
          :status="order.status"
        />
        
        <EmptyState
          v-if="filteredOrders.length === 0"
          :title="$t('cart.emptyTitle')"
          :description="$t('cart.emptyDescription')"
        />
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonSearchbar,
} from "@ionic/vue";
import { computed, ref } from "vue";
import { useCustomerOrders } from "./composables/useCustomerOrders.composable";
import { ORDER_STATUS } from "@/integration/dtos";
import { OrderListItem, SecondaryHeader, EmptyState } from "@/components";

const { mockOrders } = useCustomerOrders();

const searchFilter = ref("");
const orderStatus = [
  "all",
  ORDER_STATUS.PENDING,
  ORDER_STATUS.IN_PROGRESS,
  ORDER_STATUS.DONE,
];
const selectedStatus = ref("all");

const filteredOrders = computed(() => {
  return mockOrders.value.filter((order) => {
    const matchesSearch = order.reference
      .toLocaleLowerCase()
      .includes(searchFilter.value.toLocaleLowerCase());
    const matchesStatus = selectedStatus.value === "all" || order.status === selectedStatus.value;
    return matchesSearch && matchesStatus;
  });
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
