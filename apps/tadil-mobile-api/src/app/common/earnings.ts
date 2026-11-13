import { DataReader } from '@tadil-database';

/** What a tailor or driver earns on one order, as shown on their order screens. */
export interface OrderEarning {
  /** Their share in SAR: what was credited, or what they will get. */
  myEarning: number;
  /** True once the share has been added to their wallet. */
  myEarningPaid: boolean;
}

// Same fallback the crediting uses (confirmReceipt.usecase.ts).
const DEFAULT_RATE = 10;

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Works out each order's earning for one user. Orders already credited show
 * the amount actually added to the wallet; the rest show order total x the
 * user's admin rate x the number of legs they do on it (a driver doing both
 * the pickup and the return is paid for each).
 */
export async function getOrderEarnings(
  dataReader: DataReader,
  userId: string,
  orders: { id: string; totalPrice: number }[],
  legsFor: (order: any) => number = () => 1,
): Promise<Map<string, OrderEarning>> {
  const result = new Map<string, OrderEarning>();
  if (orders.length === 0) return result;

  const [user, credited] = await Promise.all([
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

  const rate = user?.commissionRate || DEFAULT_RATE;
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
        : {
            myEarning: round2(
              ((order.totalPrice * rate) / 100) * Math.max(1, legsFor(order)),
            ),
            myEarningPaid: false,
          },
    );
  }
  return result;
}
