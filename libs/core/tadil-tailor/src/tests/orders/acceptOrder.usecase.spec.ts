
import {
  AcceptOrderCommand,
  AcceptOrderUseCase,
} from '../../application/orders/acceptOrder.usecase';
import { TailorRepository } from '../../application/tailor.repository';
import {
  InvalidCommandException,
  InfrastructureException,
} from '@tadil-common';

describe('AcceptOrderUseCase', () => {
  let tailorRepository: TailorRepository;
  let acceptOrderUseCase: AcceptOrderUseCase;

  beforeEach(() => {
    tailorRepository = {
      acceptOrder: jest.fn(),
      declineOrder: jest.fn(),
    };
    acceptOrderUseCase = new AcceptOrderUseCase(tailorRepository);
  });

  it('should accept an order successfully', async () => {
    const command = new AcceptOrderCommand('tailor-id', 'order-id');
    await acceptOrderUseCase.execute(command);
    expect(tailorRepository.acceptOrder).toHaveBeenCalledWith(
      'tailor-id',
      'order-id'
    );
  });

  it('should throw InvalidCommandException if tailorId is not provided', async () => {
    const command = new AcceptOrderCommand('', 'order-id');
    await expect(acceptOrderUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Tailor Id should be provided')
    );
  });

  it('should throw InvalidCommandException if orderId is not provided', async () => {
    const command = new AcceptOrderCommand('tailor-id', '');
    await expect(acceptOrderUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Order Id should be provided')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new AcceptOrderCommand('tailor-id', 'order-id');
    (tailorRepository.acceptOrder as jest.Mock).mockRejectedValue(new Error('DB Error'));
    await expect(acceptOrderUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
