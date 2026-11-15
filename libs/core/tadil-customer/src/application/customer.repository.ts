export interface CustomerRepository {
  /**
   * Closes the order when it belongs to this customer and is out for delivery
   * to them. False when nothing changed, so a repeat cannot pay out twice.
   */
  confirmReceipt(customerId: string, orderId: string): Promise<boolean>;
}
