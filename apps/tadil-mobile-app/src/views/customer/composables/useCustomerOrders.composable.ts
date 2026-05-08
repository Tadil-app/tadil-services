import { computed, ref } from "vue";
import { ORDER_STATUS, type OrderStatusType } from "@/integration/dtos";

export interface CustomerOrderMock {
  reference: string;
  date: string;
  totalPrice: number;
  status: OrderStatusType;
  itemsCount: number;
}

const mockOrders = ref<CustomerOrderMock[]>([
  {
    reference: "ORD-7721",
    date: new Date().toISOString(),
    totalPrice: 150,
    status: ORDER_STATUS.PENDING,
    itemsCount: 2,
  },
  {
    reference: "ORD-6542",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    totalPrice: 85,
    status: ORDER_STATUS.IN_PROGRESS,
    itemsCount: 1,
  },
  {
    reference: "ORD-5531",
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    totalPrice: 210,
    status: ORDER_STATUS.DONE,
    itemsCount: 3,
  },
  {
    reference: "ORD-4420",
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    totalPrice: 120,
    status: ORDER_STATUS.WAITING_FOR_TAILOR_ASSIGNMENT,
    itemsCount: 1,
  },
  {
    reference: "ORD-3310",
    date: new Date(Date.now() - 604800000).toISOString(), // Last week
    totalPrice: 45,
    status: ORDER_STATUS.DONE,
    itemsCount: 1,
  },
]);

export function useCustomerOrders() {
  const pendingOrders = computed(() =>
    mockOrders.value.filter((o) => o.status === ORDER_STATUS.PENDING),
  );
  const inProgressOrders = computed(() =>
    mockOrders.value.filter((o) => o.status === ORDER_STATUS.IN_PROGRESS),
  );
  const doneOrders = computed(() =>
    mockOrders.value.filter((o) => o.status === ORDER_STATUS.DONE),
  );

  return {
    mockOrders,
    pendingOrders,
    inProgressOrders,
    doneOrders,
  };
}
