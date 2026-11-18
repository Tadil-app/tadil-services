import { tailorPayout } from '@tadil-common';
import { DataReader, getPlatformSettings } from '@tadil-database';

/** What a tailor or driver earns on one order, as shown on their order screens. */
export interface OrderEarning {
  /** Their share in SAR: what was credited, or what they will get. */
  myEarning: number;
  /** True once the share has been added to their wallet. */
  myEarningPaid: boolean;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Works out each order's earning for one user. Orders already credited show
 * the amount actually added to the wallet; the rest show what the crediting
 * (confirmReceipt.usecase.ts) will pay: a tailor's rate of the items total,
 * or a driver's base payout per trip (doing both trips is paid twice).
 * Pass `tripsFor` for drivers; without it the user is paid as the tailor.
 */
export async function getOrderEarnings(
  dataReader: DataReader,
  userId: string,
  orders: { id: string; totalPrice: number; deliveryFee: number }[],
  tripsFor?: (order: any) => number,
): Promise<Map<string, OrderEarning>> {
  const result = new Map<string, OrderEarning>();
  if (orders.length === 0) return result;

  const [settings, user, credited] = await Promise.all([
    getPlatformSettings(dataReader.queries),
    dataReader.queries.user.findUnique({
      where: { id: userId },
      select: { commissionRate: true },
    }),
    dataReader.queries.transaction.groupBy({
      by: ['orderId'],
      where: {
        userId,
        type: 'EARNING',
        orderId: { in: orders.map((o) => o.id) },
      },
      _sum: { amount: true },
    }),
  ]);

  const expected = (order: { totalPrice: number; deliveryFee: number }) =>
    tripsFor
      ? settings.courierBasePayout * tripsFor(order)
      : tailorPayout(order.totalPrice - order.deliveryFee, user?.commissionRate, settings);
  const paidByOrder = new Map<string, number>(
    credited.map((c: { orderId: string | null; _sum: { amount: number | null } }) => [
      c.orderId as string,
      c._sum.amount ?? 0,
    ]),
  );

  for (const order of orders) {
    const paid = paidByOrder.get(order.id);
    result.set(
      order.id,
      paid != null
        ? { myEarning: round2(paid), myEarningPaid: true }
        : { myEarning: round2(expected(order)), myEarningPaid: false },
    );
  }
  return result;
}
