export interface CustomerRepository {
  confirmReceipt(orderId: string): Promise<void>;
}
