<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">{{ $t("orders.title") }}</h1>
      <p class="text-muted-foreground">{{ $t("orders.subtitle") }}</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 items-end bg-card p-4 rounded-lg border shadow-sm">
      <div class="space-y-1.5">
        <label class="text-xs font-medium uppercase text-muted-foreground">{{ $t("orders.filters.status") }}</label>
        <SelectMenu v-model="filters.status" :options="statusOptions" class="w-48" />
      </div>
      <div class="space-y-1.5">
        <label class="text-xs font-medium uppercase text-muted-foreground">{{ $t("orders.filters.tailor") }}</label>
        <SelectMenu v-model="filters.tailorId" :options="tailorOptions" class="w-48" />
      </div>
      <div class="space-y-1.5">
        <label class="text-xs font-medium uppercase text-muted-foreground">{{ $t("orders.filters.courier") }}</label>
        <SelectMenu v-model="filters.courierId" :options="courierOptions" class="w-48" />
      </div>
      <Button variant="outline" @click="resetFilters">
        {{ $t("orders.buttons.reset") }}
      </Button>
    </div>

    <!-- Orders Table -->
    <div class="bg-card rounded-lg border shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs uppercase bg-muted/50">
            <tr>
              <th class="px-6 py-4 font-medium">{{ $t("orders.table.reference") }}</th>
              <th class="px-6 py-4 font-medium">{{ $t("orders.table.date") }}</th>
              <th class="px-6 py-4 font-medium">{{ $t("orders.table.customer") }}</th>
              <th class="px-6 py-4 font-medium">{{ $t("orders.table.tailor") }}</th>
              <th class="px-6 py-4 font-medium">{{ $t("orders.table.courier") }}</th>
              <th class="px-6 py-4 font-medium">{{ $t("orders.table.status") }}</th>
              <th class="px-6 py-4 font-medium text-right">{{ $t("orders.table.total") }}</th>
              <th class="px-6 py-4 font-medium text-right">{{ $t("orders.table.actions") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-if="isLoading">
              <td colspan="8" class="px-6 py-10 text-center text-muted-foreground">
                <Loader2 class="h-6 w-6 animate-spin mx-auto mb-2" />
                {{ $t("common.loading") }}
              </td>
            </tr>
            <tr v-else-if="orders.length === 0">
              <td colspan="8" class="px-6 py-10 text-center text-muted-foreground">
                {{ $t("orders.table.empty") }}
              </td>
            </tr>
            <tr v-for="order in orders" :key="order.id" class="hover:bg-muted/30 transition-colors">
              <td class="px-6 py-4 font-medium">#{{ order.reference }}</td>
              <td class="px-6 py-4 text-xs whitespace-nowrap">{{ formatDate(order.date) }}</td>
              <td class="px-6 py-4">
                {{ order.customerName }}
              </td>
              <td class="px-6 py-4 text-xs">
                {{ order.tailorName || '---' }}
              </td>
              <td class="px-6 py-4 text-xs">
                {{ order.courierName || '---' }}
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                  :class="statusClasses(order.status)"
                >
                  {{ $t('orderStatus.' + order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right font-semibold">
                {{ order.totalPrice }} {{ $t("common.currencies.ras") }}
              </td>
              <td class="px-6 py-4 text-right">
                <Button 
                  v-if="canAssignTailor(order)" 
                  variant="outline" 
                  size="sm" 
                  @click="openAssignModal(order)"
                >
                  {{ $t("orders.buttons.assignTailor") }}
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Assign Tailor Modal -->
    <Modal v-model="isAssignModalOpen" @close-modal="closeAssignModal">
      <div class="space-y-4">
        <h1 class="text-xl font-bold">{{ $t("orders.assignModal.title") }}</h1>
        <p class="text-sm text-muted-foreground">
          {{ $t("orders.assignModal.subtitle", { ref: selectedOrder?.reference }) }}
        </p>
        
        <div class="space-y-1.5">
          <InputLabel>{{ $t("orders.assignModal.selectLabel") }}</InputLabel>
          <SelectMenu v-model="tailorToAssign" :options="availableTailors" />
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <Button variant="outline" @click="closeAssignModal">{{ $t("common.buttons.cancel") }}</Button>
          <Button @click="handleAssign" :disabled="!tailorToAssign || isProcessing">
            <Loader2 v-if="isProcessing" class="h-4 w-4 animate-spin me-2" />
            {{ $t("orders.assignModal.submit") }}
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { apiClient, type DisplayOrderDTO, type DisplayUserDTO } from "@/integration";
import { SelectMenu, Button, Modal, InputLabel } from "@/components";
import { Loader2 } from "lucide-vue-next";

const orders = ref<DisplayOrderDTO[]>([]);
const isLoading = ref(true);
const isProcessing = ref(false);

const filters = ref({
  status: "all",
  tailorId: "all",
  courierId: "all",
});

const tailors = ref<DisplayUserDTO[]>([]);
const couriers = ref<DisplayUserDTO[]>([]);

// Options for filters
const statusOptions = [
  { key: "all", label: "All Statuses" },
  { key: "pending", label: "Pending" },
  { key: "waitingForTailorAssignement", label: "Waiting for Tailor" },
  { key: "waitingForCourierAssignement", label: "Waiting for Courier" },
  { key: "inProgress", label: "In Progress" },
  { key: "done", label: "Done" },
];

const tailorOptions = computed(() => [
  { key: "all", label: "All Tailors" },
  ...tailors.value.map(t => ({ key: t.id, label: `${t.firstName} ${t.lastName}` }))
]);

const courierOptions = computed(() => [
  { key: "all", label: "All Couriers" },
  ...couriers.value.map(c => ({ key: c.id, label: `${c.firstName} ${c.lastName}` }))
]);

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

const resetFilters = () => {
  filters.value = { status: "all", tailorId: "all", courierId: "all" };
};

watch(filters, () => {
  fetchOrders();
}, { deep: true });

// Assign Tailor Modal logic
const isAssignModalOpen = ref(false);
const selectedOrder = ref<DisplayOrderDTO | null>(null);
const tailorToAssign = ref("");

const availableTailors = computed(() => 
  tailors.value.map((t: DisplayUserDTO) => ({ key: t.id, label: `${t.firstName} ${t.lastName} (${t.city || 'No City'})` }))
);

const openAssignModal = (order: DisplayOrderDTO) => {
  selectedOrder.value = order;
  isAssignModalOpen.value = true;
};

const closeAssignModal = () => {
  isAssignModalOpen.value = false;
  selectedOrder.value = null;
  tailorToAssign.value = "";
};

const handleAssign = async () => {
  if (!selectedOrder.value || !tailorToAssign.value) return;
  isProcessing.value = true;
  try {
    await apiClient.ordersControllerAssignTailor(selectedOrder.value.id, tailorToAssign.value);
    await fetchOrders();
    closeAssignModal();
  } catch (error) {
    console.error("Failed to assign tailor", error);
  } finally {
    isProcessing.value = false;
  }
};

const canAssignTailor = (order: DisplayOrderDTO) => {
  return order.status === "waitingForTailorAssignement" || order.status === "pending";
};

const statusClasses = (status: string) => {
  switch (status) {
    case "done": return "text-green-700 bg-green-500/20 border-green-500/30";
    case "pending": return "text-amber-700 bg-amber-500/20 border-amber-500/30";
    case "inProgress": return "text-blue-700 bg-blue-500/20 border-blue-500/30";
    default: return "text-purple-700 bg-purple-500/20 border-purple-500/30";
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString();
};

onMounted(() => {
  fetchInitialData();
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
