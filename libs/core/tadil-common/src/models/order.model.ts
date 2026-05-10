export const ORDER_STATUS = {
  PENDING: 'pending',
  WAITING_FOR_TAILOR_ASSIGNMENT: 'waitingForTailorAssignement',
  WAITING_FOR_COURIER_ASSIGNMENT: 'waitingForCourierAssignement',
  WAITING_FOR_PICKUP_FROM_CUSTOMER: 'waitingForPickupFromCustomer',
  WAITING_FOR_DROPOFF_TO_TAILOR: 'waitingForDropoffToTailor',
  IN_PROGRESS: 'inProgress',
  WAITING_FOR_RETURN_COURIER_ASSIGNMENT: 'waitingForReturnCourierAssignement',
  WAITING_FOR_PICKUP_FROM_TAILOR: 'waitingForPickupFromTailor',
  WAITING_FOR_DROPOFF_TO_CUSTOMER: 'waitingForDropoffToCustomer',
  DONE: 'done',
};
export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export interface OrderItemAlterationInformation {
  id: string;
  englishName: string;
  arabicName: string;
  urduName: string;
  hindiName: string;
  bengaliName: string;
  type: string;
  unit?: string;
  value: string;
}

export interface OrderItemAlteration {
  id: string;
  englishName: string;
  arabicName: string;
  urduName: string;
  hindiName: string;
  bengaliName: string;
  price: number;
  customCoordinates: { x: number; y: number }[];
  informations: OrderItemAlterationInformation[];
}

export interface OrderItemSection {
  id: string;
  englishName: string;
  arabicName: string;
  urduName: string;
  hindiName: string;
  bengaliName: string;
  coordinates: { x: number; y: number }[];
  imageFileId: string;
  alterations: OrderItemAlteration[];
}

export interface OrderItem {
  id: string;
  price: number;
  englishName: string;
  arabicName: string;
  urduName: string;
  hindiName: string;
  bengaliName: string;
  imageFileId: string;
  sections: OrderItemSection[];
}

export interface CustomOrderItem {
  id: string;
  price: number;
  imageFileId: string;
  alterations: OrderItemAlteration[];
}

export interface Order {
  id: string
  customerId: string;
  addressId: string;
  reference: string;
  date: string;
  totalPrice: number;
  status: OrderStatusType;
  items: OrderItem[];
  customItems: CustomOrderItem[];

  assignedTailorId?: string;
  assignedCourierId?: string;
  assignedReturnCourierId?: string;
}
