export interface TailorRepository {
  acceptOrder(tailorId: string, orderId: string): Promise<void>;
  declineOrder(tailorId: string, orderId: string): Promise<void>;
  confirmReceipt(orderId: string): Promise<void>;
  markReady(orderId: string): Promise<void>;
}
