
import {
  CreateExtraCommand,
  CreateExtraUseCase,
} from '../application/createExtra.usecase';
import { ExtrasRepository } from '../application/extras.repository';
import {
  InvalidCommandException,
  InfrastructureException,
} from '@tadil-common';

jest.mock('uuid', () => ({ v4: () => 'mocked-uuid' }));

describe('CreateExtraUseCase', () => {
  let extrasRepository: ExtrasRepository;
  let createExtraUseCase: CreateExtraUseCase;

  beforeEach(() => {
    extrasRepository = {
      createExtra: jest.fn(),
      getExtraById: jest.fn(),
      updateExtra: jest.fn(),
      deleteExtra: jest.fn(),
    };
    createExtraUseCase = new CreateExtraUseCase(extrasRepository);
  });

  it('should create an extra successfully', async () => {
    const command = new CreateExtraCommand(
      'test',
      'test',
      'test',
      'test',
      'test',
      10
    );
    await createExtraUseCase.execute(command);
    expect(extrasRepository.createExtra).toHaveBeenCalled();
  });

  it('should throw InvalidCommandException if englishName is not provided', async () => {
    const command = new CreateExtraCommand(
      '',
      'test',
      'test',
      'test',
      'test',
      10
    );
    await expect(createExtraUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('English name is required')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new CreateExtraCommand(
      'test',
      'test',
      'test',
      'test',
      'test',
      10
    );
    (extrasRepository.createExtra as jest.Mock).mockRejectedValue(
      new Error('DB Error')
    );
    await expect(createExtraUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
