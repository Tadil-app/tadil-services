<template>
  <IonPage>
    <MainHeader />
    <IonContent>
      <IonRefresher slot="fixed" @ion-refresh="fetchOrders">
        <IonRefresherContent refreshing-spinner="bubbles" />
      </IonRefresher>
      <div
        class="ion-padding text-white bg-linear-to-br from-primary via-secondary to-tertiary shadow-lg rounded-b-4xl"
      >
        <h3 class="text-2xl font-bold mb-4">{{ $t("courier.dashboard.title") }}</h3>
        <div v-if="isLoading" class="flex justify-center py-4">
          <IonSpinner name="crescent" color="light" />
        </div>
        <StatsGrid
          v-else
          :stats="[
            {
              label: 'waitingForCourierAssignement',
              count: pendingPickups.length,
            },
            { label: 'inProgress', count: activeOrdersCount },
          ]"
        />
      </div>

      <div v-if="isLoading" class="flex justify-center py-10">
        <IonSpinner name="crescent" />
      </div>

      <template v-else>
        <!-- Trips in progress: where to drive now -->
        <section v-if="activeTrips.length > 0" class="mt-4">
          <h2 class="px-4 py-2 font-bold">
            {{ $t("courier.dashboard.activeTrips") }}
            <span class="ms-2 px-2 py-0.5 rounded-full bg-primary text-xs text-white">
              {{ activeTrips.length }}
            </span>
          </h2>
          <div class="px-2 space-y-2">
            <CourierTripListItem
              v-for="order in activeTrips"
              :key="order.id"
              :order="order"
              @click="goToOrder(order.id)"
            />
          </div>
        </section>

        <!-- New trip requests waiting for a driver -->
        <section class="mt-4 pb-6">
          <h2 class="px-4 py-2 font-bold flex items-center justify-between">
            <span>
              {{ $t("courier.dashboard.newRequests") }}
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

          <div v-if="pendingPickups.length === 0" class="text-center py-10 text-muted-foreground bg-gray-50 mx-4 rounded-2xl">
            <p>{{ $t("courier.dashboard.noPendingPickups") }}</p>
          </div>
          <div v-else class="px-2 space-y-2">
            <CourierTripListItem
              v-for="order in pendingPickups.slice(0, 5)"
              :key="order.id"
              :order="order"
              @click="goToOrder(order.id)"
            />
          </div>
        </section>
      </template>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { MainHeader, StatsGrid } from "@/components";
import {
  IonPage,
  IonContent,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  onIonViewWillEnter,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { useCourierOrdersStore } from "@/stores";
import { storeToRefs } from "pinia";
import CourierTripListItem from "./components/CourierTripListItem.vue";

const router = useRouter();
const ordersStore = useCourierOrdersStore();
const {
  isLoading,
  pendingPickups,
  activeTrips,
  activeOrdersCount,
} = storeToRefs(ordersStore);
const { fetchOrders } = ordersStore;

function goToOrder(id: string) {
  router.push(`/courier/orders/${id}`);
}

onIonViewWillEnter(() => {
  fetchOrders();
});
</script>
