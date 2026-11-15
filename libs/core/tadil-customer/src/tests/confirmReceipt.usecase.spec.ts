import { InvalidCommandException } from '@tadil-common';
import { ConfirmReceiptUseCase } from '../application/orders/confirmReceipt.usecase';
import { CustomerRepository } from '../application/customer.repository';

describe('ConfirmReceiptUseCase', () => {
  const order = {
    id: 'order-1',
    totalPrice: 200,
    assignedTailorId: 'tailor-1',
    assignedCourierId: 'courier-1',
    assignedReturnCourierId: 'courier-2',
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
      getUserById: jest.fn((id: string) => Promise.resolve({ id, commissionRate: 10 })),
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
      useCase.execute({ customerId: 'customer-1', orderId: 'order-1' })
    ).resolves.toBe(true);

    expect(customerRepository.confirmReceipt).toHaveBeenCalledWith('customer-1', 'order-1');
    expect(creditOrderEarning.execute).toHaveBeenCalledTimes(3);
  });

  it('credits nothing when the order was not closed by this call', async () => {
    // Someone else's order, the wrong status, or a repeated request.
    customerRepository.confirmReceipt.mockResolvedValue(false);

    await expect(
      useCase.execute({ customerId: 'customer-1', orderId: 'order-1' })
    ).resolves.toBe(false);

    expect(ordersRepository.getById).not.toHaveBeenCalled();
    expect(creditOrderEarning.execute).not.toHaveBeenCalled();
  });

  it('pays once when confirmed twice', async () => {
    customerRepository.confirmReceipt
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    await useCase.execute({ customerId: 'customer-1', orderId: 'order-1' });
    await useCase.execute({ customerId: 'customer-1', orderId: 'order-1' });

    expect(creditOrderEarning.execute).toHaveBeenCalledTimes(3);
  });

  it('requires the customer', async () => {
    await expect(
      useCase.execute({ customerId: '', orderId: 'order-1' })
    ).rejects.toThrow(InvalidCommandException);
  });
});
