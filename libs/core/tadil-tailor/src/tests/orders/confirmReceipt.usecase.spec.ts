import { InvalidCommandException } from '@tadil-common';
import { ConfirmReceiptUseCase } from '../../application/orders/confirmReceipt.usecase';
import { TailorRepository } from '../../application/tailor.repository';

describe('ConfirmReceiptUseCase', () => {
  const repository: TailorRepository = {
    acceptOrder: jest.fn(),
    declineOrder: jest.fn(),
    confirmReceipt: jest.fn(),
    markReady: jest.fn(),
  };
  const useCase = new ConfirmReceiptUseCase(repository);

  beforeEach(() => jest.clearAllMocks());

  it('confirms receipt for the assigned tailor', async () => {
    (repository.confirmReceipt as jest.Mock).mockResolvedValue(true);

    await expect(
      useCase.execute({ tailorId: 'tailor-id', orderId: 'order-id' })
    ).resolves.toBe(true);
    expect(repository.confirmReceipt).toHaveBeenCalledWith(
      'tailor-id',
      'order-id'
    );
  });

  it('returns false when ownership or status does not match', async () => {
    (repository.confirmReceipt as jest.Mock).mockResolvedValue(false);

    await expect(
      useCase.execute({ tailorId: 'tailor-id', orderId: 'order-id' })
    ).resolves.toBe(false);
  });

  it('requires a tailor ID', async () => {
    await expect(
      useCase.execute({ tailorId: '', orderId: 'order-id' })
    ).rejects.toThrow(new InvalidCommandException('Tailor ID is required'));
  });
});
