
import {
  UpdateExtraCommand,
  UpdateExtraUseCase,
} from '../application/updateExtra.usecase';
import { ExtrasRepository } from '../application/extras.repository';
import {
  InvalidCommandException,
  NotFoundException,
  InfrastructureException,
} from '@tadil-common';
import { Extra } from '../application/extra.model';

describe('UpdateExtraUseCase', () => {
  let extrasRepository: ExtrasRepository;
  let updateExtraUseCase: UpdateExtraUseCase;

  beforeEach(() => {
    extrasRepository = {
      createExtra: jest.fn(),
      getExtraById: jest.fn(),
      updateExtra: jest.fn(),
      deleteExtra: jest.fn(),
    };
    updateExtraUseCase = new UpdateExtraUseCase(extrasRepository);
  });

  it('should update an extra successfully', async () => {
    const command = new UpdateExtraCommand(
      'test-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      10
    );
    (extrasRepository.getExtraById as jest.Mock).mockResolvedValue({
      id: 'test-id',
    } as Extra);
    await updateExtraUseCase.execute(command);
    expect(extrasRepository.updateExtra).toHaveBeenCalledWith(command);
  });

  it('should throw InvalidCommandException if id is not provided', async () => {
    const command = new UpdateExtraCommand(
      '',
      'test',
      'test',
      'test',
      'test',
      'test',
      10
    );
    await expect(updateExtraUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Extra ID is required')
    );
  });

  it('should throw NotFoundException if extra is not found', async () => {
    const command = new UpdateExtraCommand(
      'test-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      10
    );
    (extrasRepository.getExtraById as jest.Mock).mockResolvedValue(undefined);
    await expect(updateExtraUseCase.execute(command)).rejects.toThrow(
      new NotFoundException('Extra not found')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new UpdateExtraCommand(
      'test-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      10
    );
    (extrasRepository.getExtraById as jest.Mock).mockResolvedValue({
      id: 'test-id',
    } as Extra);
    (extrasRepository.updateExtra as jest.Mock).mockRejectedValue(
      new Error('DB Error')
    );
    await expect(updateExtraUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
