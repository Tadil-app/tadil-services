<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">{{ $t("orders.title") }}</h1>
      <p class="text-muted-foreground">{{ $t("orders.subtitle") }}</p>
    </div>

    <!-- Filters -->
    <OrdersFilters 
      v-model="filters" 
      :status-options="statusOptions" 
      :tailor-options="tailorOptions" 
      :courier-options="courierOptions" 
    />

    <!-- Orders Table (including modals) -->
    <OrdersTable 
      :orders="orders" 
      :is-loading="isLoading" 
      :available-tailors="availableTailors"
      @refresh="fetchOrders"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { apiClient, type DisplayOrderDTO, type DisplayUserDTO } from "@/integration";
import { useI18n } from "vue-i18n";
import OrdersFilters from "./components/OrdersFilters.vue";
import OrdersTable from "./components/OrdersTable.vue";

const { t } = useI18n();

const orders = ref<DisplayOrderDTO[]>([]);
const isLoading = ref(true);

const filters = ref({
  status: "all",
  tailorId: "all",
  courierId: "all",
});

const tailors = ref<DisplayUserDTO[]>([]);
const couriers = ref<DisplayUserDTO[]>([]);

// Options for filters
const statusOptions = computed(() => [
  { key: "all", label: t("orders.filters.allStatuses") },
  { key: "pending", label: t("orderStatus.pending") },
  { key: "waitingForTailorAssignement", label: t("orderStatus.waitingForTailorAssignement") },
  { key: "waitingForCourierAssignement", label: t("orderStatus.waitingForCourierAssignement") },
  { key: "inProgress", label: t("orderStatus.inProgress") },
  { key: "done", label: t("orderStatus.done") },
  { key: "canceled", label: t("orderStatus.canceled") },
]);

const tailorOptions = computed(() => [
  { key: "all", label: t("orders.filters.allTailors") },
  ...tailors.value.map(t => ({ key: t.id, label: `${t.firstName} ${t.lastName}` }))
]);

const courierOptions = computed(() => [
  { key: "all", label: t("orders.filters.allCouriers") },
  ...couriers.value.map(c => ({ key: c.id, label: `${c.firstName} ${c.lastName}` }))
]);

const availableTailors = computed(() => 
  tailors.value.map((user: DisplayUserDTO) => ({ key: user.id, label: `${user.firstName} ${user.lastName} (${user.city || 'No City'})` }))
);

const fetchOrders = async () => {
  isLoading.value = true;
  try {
    const query: any = {};
    if (filters.value.status !== "all") query.status = filters.value.status;
    if (filters.value.tailorId !== "all") query.tailorId = filters.value.tailorId;
    if (filters.value.courierId !== "all") query.courierId = filters.value.courierId;
    
    const response = await apiClient.ordersControllerGetOrders(query);
    orders.value = response.data;
  } catch (error) {
    console.error("Failed to fetch orders", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchInitialData = async () => {
  try {
    const [tailorsRes, couriersRes] = await Promise.all([
      apiClient.tailorsControllerGetTailors(),
      apiClient.couriersControllerGetCouriers(),
    ]);
    tailors.value = tailorsRes.data;
    couriers.value = couriersRes.data;
  } catch (error) {
    console.error("Failed to fetch tailors/couriers", error);
  }
};

watch(filters, () => {
  fetchOrders();
}, { deep: true });

onMounted(() => {
  fetchInitialData();
  fetchOrders();
});
</script>

<style scoped>
</style>
