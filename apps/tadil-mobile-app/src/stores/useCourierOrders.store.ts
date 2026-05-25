import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { apiClient } from "@/integration/api";
import { DisplayOrderDTO, ORDER_STATUS } from "@/integration/dtos";
import { useAuthStore } from "./useAuth.store";
import { RefresherCustomEvent } from "@ionic/vue";
import { useToast } from "@/composables";
import { useI18n } from "vue-i18n";

export const useCourierOrdersStore = defineStore("courierOrders", () => {
  const orders = ref<DisplayOrderDTO[]>([]);
  const isLoading = ref(false);
  const { showToast } = useToast();
  const { t } = useI18n();

  const pendingPickups = computed(() =>
    orders.value.filter(
      (o) =>
        o.status === ORDER_STATUS.WAITING_FOR_COURIER_ASSIGNMENT ||
        o.status === ORDER_STATUS.WAITING_FOR_RETURN_COURIER_ASSIGNMENT,
    ),
  );

  const activeOrdersCount = computed(
    () =>
      orders.value.filter(
        (o) =>
          o.status === ORDER_STATUS.WAITING_FOR_PICKUP_FROM_CUSTOMER ||
          o.status === ORDER_STATUS.WAITING_FOR_DROPOFF_TO_TAILOR ||
          o.status === ORDER_STATUS.WAITING_FOR_PICKUP_FROM_TAILOR ||
          o.status === ORDER_STATUS.WAITING_FOR_DROPOFF_TO_CUSTOMER,
      ).length,
  );

  async function fetchOrders(refresher?: RefresherCustomEvent) {
    const authStore = useAuthStore();
    if (!authStore.userId) return;
    isLoading.value = true;
    try {
      const { data } = await apiClient.courierControllerGetOrders(
        authStore.userId,
      );
      orders.value = data;
    } catch (error) {
      showToast({ message: t("common.errors.loadOrders"), color: "danger" });
    } finally {
      isLoading.value = false;
      if (refresher) {
        refresher.target.complete();
      }
    }
  }

  return {
    orders,
    isLoading,
    pendingPickups,
    activeOrdersCount,
    fetchOrders,
  };
});
