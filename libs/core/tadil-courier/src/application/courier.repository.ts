export interface CourierRepository {
  /** False when the trip is no longer waiting for a driver or this driver declined it. */
  acceptAssignment(courierId: string, orderId: string, isReturn: boolean): Promise<boolean>;
  declineAssignment(courierId: string, orderId: string, isReturn: boolean): Promise<void>;
  /** False unless this driver is assigned to the leg that is waiting for pickup. */
  confirmPickup(courierId: string, orderId: string): Promise<boolean>;
  /** False unless this driver is carrying the order on its current leg. */
  markAsDelivered(courierId: string, orderId: string): Promise<boolean>;
}
