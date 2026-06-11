export interface PaymentGateway {
  verifyPayment(paymentId: string, amountExpected: number): Promise<boolean>;
}
