export interface CourierRepository {
  acceptAssignment(courierId: string, orderId: string, isReturn: boolean): Promise<void>;
  declineAssignment(courierId: string, orderId: string, isReturn: boolean): Promise<void>;
  confirmPickup(orderId: string): Promise<void>;
  markAsDelivered(orderId: string): Promise<void>;
}
