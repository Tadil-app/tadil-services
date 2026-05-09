import { computed, ref } from "vue";
import { ORDER_STATUS, type DisplayOrderDTO } from "@/integration/dtos";
import { apiClient } from "@/integration/api";

export function useCustomerOrders() {
  const orders = ref<DisplayOrderDTO[]>([]);
  const isLoading = ref(false);

  const pendingOrders = computed(() =>
    orders.value.filter((o) => o.status === ORDER_STATUS.PENDING),
  );
  const inProgressOrders = computed(() =>
    orders.value.filter((o) => 
      o.status !== ORDER_STATUS.PENDING && 
      o.status !== ORDER_STATUS.DONE
    ),
  );
  const doneOrders = computed(() =>
    orders.value.filter((o) => o.status === ORDER_STATUS.DONE),
  );

  async function fetchOrders() {
    isLoading.value = true;
    try {
      const { data } = await apiClient.customerControllerGetOrders();
      orders.value = data;
    } catch (error) {
      console.error("Failed to fetch customer orders", error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    orders,
    pendingOrders,
    inProgressOrders,
    doneOrders,
    isLoading,
    fetchOrders,
  };
}
