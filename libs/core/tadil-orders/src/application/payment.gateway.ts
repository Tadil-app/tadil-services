export interface PaymentRecord {
  id: string;
  status: string;
  /** Amount in the smallest currency unit (halalas for SAR). */
  amount: number;
  /** ISO timestamp of creation, when the provider reports it. */
  createdAt?: string;
  metadata?: Record<string, string>;
}

export interface PaymentGateway {
  /** Returns undefined when the payment does not exist. Throws on provider failure. */
  getPayment(paymentId: string): Promise<PaymentRecord | undefined>;
  /**
   * Lists every payment tagged with `metadata.order_id`, whatever its status,
   * across all result pages. Throws on provider failure so callers never
   * mistake an outage for "no payment".
   */
  findPaymentsForOrder(orderId: string): Promise<PaymentRecord[]>;
}
