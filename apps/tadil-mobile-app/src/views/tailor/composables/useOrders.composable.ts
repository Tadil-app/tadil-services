import { apiClient } from "@/integration/api";
import { DisplayOrderDTO, ORDER_STATUS } from "@/integration/dtos";
import { useAuthStore } from "@/stores";
import { RefresherCustomEvent } from "@ionic/vue";
import { computed, ref } from "vue";
import { useToast } from "@/composables";
import { useI18n } from "vue-i18n";

const orders = ref<DisplayOrderDTO[]>([]);

export function useOrders() {
  const authStore = useAuthStore();
  const { showToast } = useToast();
  const { t } = useI18n();
  const isLoading = ref<boolean>(false);

  const pendingOrders = computed(() => {
    return orders.value.filter(
      (order) => order.status === ORDER_STATUS.WAITING_FOR_TAILOR_ASSIGNMENT,
    );
  });
  const inProgressOrders = computed(() => {
    return orders.value.filter(
      (order) => order.status === ORDER_STATUS.IN_PROGRESS,
    );
  });
  const doneOrders = computed(() => {
    return orders.value.filter(
      (order) => order.status === ORDER_STATUS.DONE,
    );
  });

  async function getOrders(refresher?: RefresherCustomEvent) {
    isLoading.value = true;
    try {
      const { data } = await apiClient.tailorControllerGetOrders(
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
    isLoading,
    orders,
    pendingOrders,
    inProgressOrders,
    doneOrders,
    getOrders,
  };
}
