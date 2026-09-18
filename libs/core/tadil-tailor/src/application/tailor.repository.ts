export interface TailorRepository {
  acceptOrder(tailorId: string, orderId: string): Promise<void>;
  declineOrder(tailorId: string, orderId: string): Promise<void>;
  confirmReceipt(tailorId: string, orderId: string): Promise<boolean>;
  markReady(orderId: string): Promise<void>;
}
