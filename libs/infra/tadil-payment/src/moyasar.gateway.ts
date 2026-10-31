import { PaymentGateway, PaymentRecord } from '@tadil-orders';

const MOYASAR_API = 'https://api.moyasar.com/v1';
// One order never has more than a handful of attempts; this only bounds a
// runaway loop if the API ignored the metadata filter.
const MAX_PAGES = 20;

export class MoyasarPaymentGateway implements PaymentGateway {
  constructor(private readonly _secretKey: string) {}

  async getPayment(paymentId: string): Promise<PaymentRecord | undefined> {
    const response = await this._request(`/payments/${encodeURIComponent(paymentId)}`);
    if (response.status === 404) return undefined;
    if (!response.ok) {
      throw new Error(`Moyasar API error: ${response.status} ${response.statusText}`);
    }
    return this._toRecord(await response.json());
  }

  async findPaymentsForOrder(orderId: string): Promise<PaymentRecord[]> {
    const found: PaymentRecord[] = [];
    let page: number | null = 1;

    while (page !== null && page <= MAX_PAGES) {
      const query = `metadata[order_id]=${encodeURIComponent(orderId)}&page=${page}`;
      const response = await this._request(`/payments?${query}`);
      if (!response.ok) {
        throw new Error(`Moyasar API error: ${response.status} ${response.statusText}`);
      }
      const body = (await response.json()) as {
        payments?: unknown;
        meta?: { next_page?: number | null };
      };
      const payments: any[] = Array.isArray(body?.payments) ? body.payments : [];
      // The metadata filter is authoritative; re-check in case the API ignores it.
      for (const p of payments) {
        if (p?.metadata?.order_id === orderId) found.push(this._toRecord(p));
      }
      page = typeof body?.meta?.next_page === 'number' ? body.meta.next_page : null;
    }

    return found;
  }

  private async _request(path: string): Promise<Response> {
    if (!this._secretKey) {
      throw new Error('MOYASAR_SECRET_KEY is not set');
    }
    return fetch(`${MOYASAR_API}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${Buffer.from(`${this._secretKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private _toRecord(payment: any): PaymentRecord {
    return {
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      createdAt: payment.created_at ?? undefined,
      metadata: payment.metadata ?? undefined,
    };
  }
}
