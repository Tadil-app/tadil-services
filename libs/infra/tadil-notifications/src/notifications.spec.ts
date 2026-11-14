import { servesArea, type ServiceArea } from './area';
import { orderPushText } from './messages';
import { OrderNotifier, planOrderPush, type OrderSnapshot } from './order.notifier';
import type { PushMessage, PushSender } from './push.sender';

const area = (over: Partial<ServiceArea> = {}): ServiceArea => ({
  cityId: 1,
  cityNameEn: 'Riyadh',
  districtId: null,
  districtNameEn: null,
  ...over,
});

describe('servesArea', () => {
  it('matches the city by id, else by name', () => {
    expect(servesArea(area(), area())).toBe(true);
    expect(servesArea(area(), area({ cityId: 2 }))).toBe(false);
    expect(servesArea(area({ cityId: null }), area({ cityId: 9 }))).toBe(true);
    expect(servesArea(area({ cityId: null }), area({ cityId: 9, cityNameEn: 'Jeddah' }))).toBe(false);
  });

  it('lets a district narrow the city only when both sides have one', () => {
    const olaya = area({ districtId: 'd1', districtNameEn: 'Olaya' });
    expect(servesArea(olaya, area())).toBe(true); // order has no district
    expect(servesArea(area(), olaya)).toBe(true); // worker serves the whole city
    expect(servesArea(olaya, olaya)).toBe(true);
    expect(servesArea(olaya, area({ districtId: 'd2', districtNameEn: 'Malaz' }))).toBe(false);
    expect(
      servesArea(area({ districtNameEn: 'Olaya' }), area({ districtId: 'x', districtNameEn: 'Olaya' }))
    ).toBe(true);
  });
});

const snapshot = (over: Partial<OrderSnapshot> = {}): OrderSnapshot => ({
  status: 'waitingForTailorAssignement',
  assignedTailorId: null,
  address: area(),
  rejectedTailorIds: [],
  rejectedCourierIds: [],
  rejectedReturnCourierIds: [],
  ...over,
});

describe('planOrderPush', () => {
  it('offers a paid order to the area tailors who have not declined it', () => {
    expect(planOrderPush(snapshot({ rejectedTailorIds: ['t9'] }))).toEqual([
      { event: 'tailor.orderAvailable', role: 'tailor', exclude: ['t9'] },
    ]);
  });

  it('tells the tailor an admin assigned, and calls the drivers', () => {
    expect(planOrderPush(snapshot({ status: 'waitingForCourierAssignement', assignedTailorId: 't1' }))).toEqual([
      { event: 'tailor.orderAssigned', userId: 't1' },
      { event: 'courier.pickupAvailable', role: 'courier', exclude: [] },
    ]);
  });

  it('does not tell a tailor about the order they just accepted', () => {
    const targets = planOrderPush(snapshot({ status: 'waitingForCourierAssignement', assignedTailorId: 't1' }), 't1');
    expect(targets).toEqual([{ event: 'courier.pickupAvailable', role: 'courier', exclude: [] }]);
  });

  it('calls return drivers when the work is ready', () => {
    expect(
      planOrderPush(snapshot({ status: 'waitingForReturnCourierAssignement', rejectedReturnCourierIds: ['c2'] }))
    ).toEqual([{ event: 'courier.returnAvailable', role: 'courier', exclude: ['c2'] }]);
  });

  it('stays quiet for other statuses', () => {
    for (const status of ['pending', 'inProgress', 'waitingForPickupFromCustomer', 'done']) {
      expect(planOrderPush(snapshot({ status }))).toEqual([]);
    }
  });
});

describe('orderPushText', () => {
  it('fills the reference and falls back to Arabic', () => {
    expect(orderPushText('tailor.orderAssigned', 'en', 'TAD-1').body).toBe('Order TAD-1 has been assigned to you.');
    expect(orderPushText('tailor.orderAssigned', 'xx', 'TAD-1').title).toBe('تم إسناد طلب جديد إليك');
  });
});

describe('OrderNotifier', () => {
  class FakeSender implements PushSender {
    sent: PushMessage[] = [];
    dead: string[] = [];
    async send(message: PushMessage) {
      this.sent.push(message);
      return message.tokens.filter((t) => this.dead.includes(t));
    }
  }

  const user = (id: string, address: ServiceArea | null, tokens: { token: string; locale: string }[], phone = '0500000000') => ({
    id,
    phone,
    addresses: address ? [address] : [],
    deviceTokens: tokens,
  });

  function setup(order: Record<string, unknown>, users: ReturnType<typeof user>[]) {
    const claimed = new Set<string>();
    const deleted: string[] = [];
    const db = {
      order: { findUnique: jest.fn(async () => order) },
      pushDispatch: {
        createMany: jest.fn(async ({ data }: { data: { key: string }[] }) => {
          if (claimed.has(data[0].key)) return { count: 0 };
          claimed.add(data[0].key);
          return { count: 1 };
        }),
      },
      user: {
        findMany: jest.fn(async ({ where }: { where: { id?: { in?: string[]; notIn?: string[] }; role?: string } }) =>
          users.filter((u) =>
            where.id?.in
              ? where.id.in.includes(u.id)
              : !where.id?.notIn?.includes(u.id) && u.id.startsWith(where.role === 'tailor' ? 't' : 'c')
          )
        ),
      },
      deviceToken: {
        deleteMany: jest.fn(async ({ where }: { where: { token: { in: string[] } } }) => {
          deleted.push(...where.token.in);
        }),
      },
    };
    const sender = new FakeSender();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { notifier: new OrderNotifier(db as any, sender), sender, deleted };
  }

  const order = (over: Record<string, unknown> = {}) => ({
    reference: 'TAD-100',
    status: 'waitingForTailorAssignement',
    assignedTailorId: null,
    address: area({ districtId: 'd1', districtNameEn: 'Olaya' }),
    rejectedTailors: [],
    rejectedCouriers: [],
    rejectedReturnCouriers: [],
    history: [{ id: 'h1', status: 'waitingForTailorAssignement' }],
    ...over,
  });

  it('sends once per status change, in each phone language, to the right area only', async () => {
    const { notifier, sender } = setup(order({ rejectedTailors: [{ id: 't4' }] }), [
      user('t1', area(), [{ token: 'a', locale: 'ar' }]),
      user('t2', area({ districtId: 'd1' }), [{ token: 'b', locale: 'en' }, { token: 'c', locale: 'ar' }]),
      user('t3', area({ districtId: 'd2' }), [{ token: 'd', locale: 'ar' }]), // other district
      user('t4', area(), [{ token: 'e', locale: 'ar' }]), // declined
      user('t5', area({ cityId: 7 }), [{ token: 'f', locale: 'ar' }]), // other city
      user('t6', area(), [{ token: 'g', locale: 'ar' }], 'deleted-123'),
    ]);

    expect(await notifier.dispatch('o1')).toBe(3);
    expect(sender.sent.map((m) => [m.tokens, m.title])).toEqual([
      [['a', 'c'], 'طلب جديد متاح'],
      [['b'], 'New order available'],
    ]);
    expect(sender.sent[0].data).toEqual({ type: 'tailor.orderAvailable', orderId: 'o1', reference: 'TAD-100' });

    // A retried payment confirmation sees the same history row: no repeat.
    expect(await notifier.dispatch('o1')).toBe(0);
    expect(sender.sent).toHaveLength(2);
  });

  it('forgets tokens FCM reports as dead', async () => {
    const { notifier, sender, deleted } = setup(order(), [user('t1', area(), [{ token: 'a', locale: 'ar' }])]);
    sender.dead = ['a'];
    await notifier.dispatch('o1');
    expect(deleted).toEqual(['a']);
  });

  it('ignores an order whose latest history does not match its status', async () => {
    const { notifier, sender } = setup(order({ history: [{ id: 'h0', status: 'pending' }] }), [
      user('t1', area(), [{ token: 'a', locale: 'ar' }]),
    ]);
    expect(await notifier.dispatch('o1')).toBe(0);
    expect(sender.sent).toHaveLength(0);
  });

  it('never throws from the fire-and-forget entry point', async () => {
    const { notifier } = setup(order(), []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (notifier as any)._db.order.findUnique = jest.fn(async () => {
      throw new Error('db down');
    });
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => notifier.orderStatusChanged('o1')).not.toThrow();
    await new Promise((r) => setImmediate(r));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
