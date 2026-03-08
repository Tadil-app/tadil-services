
import {
  CreateAlterationCommand,
  CreateAlterationUseCase,
} from '../application/createAlteration.usecase';
import { AlterationsRepository } from '../application/alterations.repository';
import {
  InvalidCommandException,
  InfrastructureException,
} from '@tadil-common';

jest.mock('uuid', () => ({ v4: () => 'mocked-uuid' }));

describe('CreateAlterationUseCase', () => {
  let alterationsRepository: AlterationsRepository;
  let createAlterationUseCase: CreateAlterationUseCase;

  beforeEach(() => {
    alterationsRepository = {
      createAlteration: jest.fn(),
      getAlterationById: jest.fn(),
      updateAlteration: jest.fn(),
      deleteAlteration: jest.fn(),
    };
    createAlterationUseCase = new CreateAlterationUseCase(
      alterationsRepository
    );
  });

  it('should create an alteration successfully', async () => {
    const command = new CreateAlterationCommand(
      'test',
      'test',
      'test',
      'test',
      'test',
      10,
      [],
      []
    );
    await createAlterationUseCase.execute(command);
    expect(alterationsRepository.createAlteration).toHaveBeenCalled();
  });

  it('should throw InvalidCommandException if englishName is not provided', async () => {
    const command = new CreateAlterationCommand(
      '',
      'test',
      'test',
      'test',
      'test',
      10,
      [],
      []
    );
    await expect(createAlterationUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('English name is required')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new CreateAlterationCommand(
      'test',
      'test',
      'test',
      'test',
      'test',
      10,
      [],
      []
    );
    (alterationsRepository.createAlteration as jest.Mock).mockRejectedValue(
      new Error('DB Error')
    );
    await expect(createAlterationUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
