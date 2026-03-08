
import {
  DeclineOrderCommand,
  DeclineOrderUseCase,
} from '../../application/orders/declineOrder.usecase';
import { TailorRepository } from '../../application/tailor.repository';
import {
  InvalidCommandException,
  InfrastructureException,
} from '@tadil-common';

describe('DeclineOrderUseCase', () => {
  let tailorRepository: TailorRepository;
  let declineOrderUseCase: DeclineOrderUseCase;

  beforeEach(() => {
    tailorRepository = {
      acceptOrder: jest.fn(),
      declineOrder: jest.fn(),
    };
    declineOrderUseCase = new DeclineOrderUseCase(tailorRepository);
  });

  it('should decline an order successfully', async () => {
    const command = new DeclineOrderCommand('tailor-id', 'order-id');
    await declineOrderUseCase.execute(command);
    expect(tailorRepository.declineOrder).toHaveBeenCalledWith(
      'tailor-id',
      'order-id'
    );
  });

  it('should throw InvalidCommandException if tailorId is not provided', async () => {
    const command = new DeclineOrderCommand('', 'order-id');
    await expect(declineOrderUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Tailor Id should be provided')
    );
  });

  it('should throw InvalidCommandException if orderId is not provided', async () => {
    const command = new DeclineOrderCommand('tailor-id', '');
    await expect(declineOrderUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Order Id should be provided')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new DeclineOrderCommand('tailor-id', 'order-id');
    (tailorRepository.declineOrder as jest.Mock).mockRejectedValue(new Error('DB Error'));
    await expect(declineOrderUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
