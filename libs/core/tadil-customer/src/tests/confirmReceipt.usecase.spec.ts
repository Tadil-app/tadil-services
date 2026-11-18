import { InvalidCommandException } from '@tadil-common';
import { ConfirmReceiptUseCase } from '../application/orders/confirmReceipt.usecase';
import { CustomerRepository } from '../application/customer.repository';

describe('ConfirmReceiptUseCase', () => {
  const order = {
    id: 'order-1',
    totalPrice: 202,
    deliveryFee: 2,
    assignedTailorId: 'tailor-1',
    assignedCourierId: 'courier-1',
    assignedReturnCourierId: 'courier-2',
  };

  const settings = {
    freeDeliveryThreshold: 300,
    courierBasePayout: 7.5,
    tailorCommissionRate: 10,
    courierCommissionRate: 6.5,
  };

  let customerRepository: jest.Mocked<CustomerRepository>;
  let ordersRepository: { getById: jest.Mock };
  let usersRepository: { getUserById: jest.Mock };
  let creditOrderEarning: { execute: jest.Mock };
  let useCase: ConfirmReceiptUseCase;

  beforeEach(() => {
    customerRepository = { confirmReceipt: jest.fn() };
    ordersRepository = { getById: jest.fn().mockResolvedValue(order) };
    usersRepository = {
      getUserById: jest.fn((id: string) => Promise.resolve({ id, commissionRate: null })),
    };
    creditOrderEarning = { execute: jest.fn().mockResolvedValue(undefined) };
    useCase = new ConfirmReceiptUseCase(
      customerRepository,
      ordersRepository as any,
      usersRepository as any,
      creditOrderEarning as any
    );
  });

  it('closes the order for its customer and credits everyone on it once', async () => {
    customerRepository.confirmReceipt.mockResolvedValue(true);

    await expect(
      useCase.execute({ customerId: 'customer-1', orderId: 'order-1', settings })
    ).resolves.toBe(true);

    expect(customerRepository.confirmReceipt).toHaveBeenCalledWith('customer-1', 'order-1');
    expect(creditOrderEarning.execute).toHaveBeenCalledTimes(3);
    const paid = creditOrderEarning.execute.mock.calls.map(([c]) => [c.userId, c.amount]);
    // Tailor: 10% of the 200 items (the fee is not theirs). Drivers: 7.5 per trip.
    expect(paid).toEqual([
      ['tailor-1', 20],
      ['courier-1', 7.5],
      ['courier-2', 7.5],
    ]);
  });

  it('credits nothing when the order was not closed by this call', async () => {
    // Someone else's order, the wrong status, or a repeated request.
    customerRepository.confirmReceipt.mockResolvedValue(false);

    await expect(
      useCase.execute({ customerId: 'customer-1', orderId: 'order-1', settings })
    ).resolves.toBe(false);

    expect(ordersRepository.getById).not.toHaveBeenCalled();
    expect(creditOrderEarning.execute).not.toHaveBeenCalled();
  });

  it('pays once when confirmed twice', async () => {
    customerRepository.confirmReceipt
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    await useCase.execute({ customerId: 'customer-1', orderId: 'order-1', settings });
    await useCase.execute({ customerId: 'customer-1', orderId: 'order-1', settings });

    expect(creditOrderEarning.execute).toHaveBeenCalledTimes(3);
  });

  it('requires the customer', async () => {
    await expect(
      useCase.execute({ customerId: '', orderId: 'order-1', settings })
    ).rejects.toThrow(InvalidCommandException);
  });
});
