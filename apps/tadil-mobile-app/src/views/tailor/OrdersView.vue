<template>
  <IonPage>
    <IonHeader class="ion-no-border">
      <SecondaryHeader
        :title="$t('tailor.orders.title')"
        :subtitle="$t('tailor.orders.subtitle')"
        :show-back-button="false"
      />
      <div class="px-4 pb-2 bg-background">
        <div class="flex items-center">
          <QrCodeScanner v-model="ordersSearchFilter" />
          <IonSearchbar
            show-clear-button="always"
            :placeholder="$t('tailor.orders.search')"
            v-model="ordersSearchFilter"
          />
        </div>
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
      <IonRefresher slot="fixed" @ion-refresh="getOrders">
        <IonRefresherContent refreshing-spinner="bubbles" />
      </IonRefresher>
      <div class="px-2 space-y-2 mt-2">
        <OrderListItem
          v-if="!isLoading"
          v-for="order in filteredOrders"
          :key="order.reference"
          :reference="order.reference"
          :date="order.date"
          :total-price="order.totalPrice"
          :status="order.status"
          @click="
            router.push({
              name: 'tailor-orders-details',
              params: { orderId: order.reference },
            })
          "
        />
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import QrCodeScanner from "@/components/ui/QrCodeScanner.vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/vue";
import { computed, ref } from "vue";
import { useOrders } from "./composables/useOrders.composable";
import { ORDER_STATUS } from "@/integration/dtos";
import { OrderListItem, SecondaryHeader } from "@/components";
import { useRouter } from "vue-router";

const { isLoading, orders, getOrders } = useOrders();
const router = useRouter();

const ordersSearchFilter = ref("");
const orderStatus = [
  "all",
  ORDER_STATUS.WAITING_FOR_TAILOR_ASSIGNMENT,
  ORDER_STATUS.IN_PROGRESS,
  ORDER_STATUS.DONE,
];
const selectedStatus = ref("all");

const filteredOrders = computed(() =>
  selectedStatus.value === "all"
    ? orders.value.filter((order) =>
        order.reference
          .toLocaleLowerCase()
          .includes(ordersSearchFilter.value.toLocaleLowerCase()),
      )
    : orders.value
        .filter((order) => order.status === selectedStatus.value)
        .filter((order) => order.reference.includes(ordersSearchFilter.value)),
);
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
