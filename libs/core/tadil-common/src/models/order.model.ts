export const ORDER_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed',
  WAITING_FOR_PICKUP: 'waitingForPickup',
};
export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export interface OrderItemAlterationInformation {
  id: string;
  sourceInformationId: string;
  value: string;
}

export interface OrderItemAlteration {
  id: string;
  sourceAlterationId: string;
  price: number;
  informations: OrderItemAlterationInformation[];
}

export interface OrderItemSection {
  id: string;
  sourceSectionId: string;
  alterations: OrderItemAlteration[];
}

export interface OrderItem {
  id: string;
  price: number;
  modelId: string;
  sections: OrderItemSection[];
}

export interface CustomOrderItem {
  id: string;
  price: number;
  alterations: OrderItemAlteration[];
}

export interface Order {
  id: string
  customerId: string;
  reference: string;
  date: string;
  totalPrice: number;
  status: OrderStatusType;
  items: OrderItem[];
  customItems: CustomOrderItem[];
}
