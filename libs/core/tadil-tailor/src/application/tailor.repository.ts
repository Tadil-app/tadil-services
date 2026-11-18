export interface TailorRepository {
  /** False when the order is no longer open to tailors or this tailor declined it. */
  acceptOrder(tailorId: string, orderId: string): Promise<boolean>;
  declineOrder(tailorId: string, orderId: string): Promise<void>;
  confirmReceipt(tailorId: string, orderId: string): Promise<boolean>;
  /** False unless the order is in progress with this tailor. */
  markReady(tailorId: string, orderId: string): Promise<boolean>;
}
