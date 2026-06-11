import { PaymentGateway } from '@tadil-orders';

export class MoyasarPaymentGateway implements PaymentGateway {
  constructor(private readonly _secretKey: string) {}

  async verifyPayment(paymentId: string, amountExpected: number): Promise<boolean> {
    if (!this._secretKey) {
      console.warn('MOYASAR_SECRET_KEY is not set. Verification will fail.');
      return false;
    }

    try {
      const response = await fetch(`https://api.moyasar.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this._secretKey}:`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`Moyasar API error: ${response.status} ${response.statusText}`);
        return false;
      }

      const payment = await response.json();

      // Ensure the payment status is 'paid' and the amount matches (Moyasar amounts are in halalas)
      const expectedHalalas = Math.round(amountExpected * 100);
      
      if (payment.status === 'paid' && payment.amount === expectedHalalas) {
        return true;
      }

      console.warn(`Payment verification failed: Status=${payment.status}, Amount=${payment.amount}, ExpectedAmount=${expectedHalalas}`);
      return false;
    } catch (error) {
      console.error('Failed to communicate with Moyasar API', error);
      return false;
    }
  }
}
