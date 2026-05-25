import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { apiClient } from "@/integration/api";
import { DisplayOrderDTO, ORDER_STATUS } from "@/integration/dtos";
import { RefresherCustomEvent } from "@ionic/vue";
import { useToast } from "@/composables";
import { useI18n } from "vue-i18n";

export const useCustomerOrdersStore = defineStore("customerOrders", () => {
  const orders = ref<DisplayOrderDTO[]>([]);
  const isLoading = ref(false);
  const { showToast } = useToast();
  const { t } = useI18n();

  const pendingOrders = computed(() =>
    orders.value.filter((o) => o.status === ORDER_STATUS.PENDING),
  );

  const inProgressOrders = computed(() =>
    orders.value.filter(
      (o) =>
        o.status !== ORDER_STATUS.PENDING && o.status !== ORDER_STATUS.DONE,
    ),
  );

  const doneOrders = computed(() =>
    orders.value.filter((o) => o.status === ORDER_STATUS.DONE),
  );

  async function fetchOrders(refresher?: RefresherCustomEvent) {
    isLoading.value = true;
    try {
      const { data } = await apiClient.customerControllerGetOrders();
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
    pendingOrders,
    inProgressOrders,
    doneOrders,
    fetchOrders,
  };
});
