
import {
  UpdateAlterationCommand,
  UpdateAlterationUseCase,
} from '../application/updateAlteration.usecase';
import { AlterationsRepository } from '../application/alterations.repository';
import {
  InvalidCommandException,
  NotFoundException,
  InfrastructureException,
} from '@tadil-common';
import { Alteration } from '../application/alteration.model';

describe('UpdateAlterationUseCase', () => {
  let alterationsRepository: AlterationsRepository;
  let updateAlterationUseCase: UpdateAlterationUseCase;

  beforeEach(() => {
    alterationsRepository = {
      createAlteration: jest.fn(),
      getAlterationById: jest.fn(),
      updateAlteration: jest.fn(),
      deleteAlteration: jest.fn(),
    };
    updateAlterationUseCase = new UpdateAlterationUseCase(
      alterationsRepository
    );
  });

  it('should update an alteration successfully', async () => {
    const command = new UpdateAlterationCommand(
      'test-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      10,
      [],
      []
    );
    (alterationsRepository.getAlterationById as jest.Mock).mockResolvedValue({
      id: 'test-id',
    } as Alteration);
    await updateAlterationUseCase.execute(command);
    expect(alterationsRepository.updateAlteration).toHaveBeenCalledWith(command);
  });

  it('should throw InvalidCommandException if id is not provided', async () => {
    const command = new UpdateAlterationCommand(
      '',
      'test',
      'test',
      'test',
      'test',
      'test',
      10,
      [],
      []
    );
    await expect(updateAlterationUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Alteration ID is required')
    );
  });

  it('should throw NotFoundException if alteration is not found', async () => {
    const command = new UpdateAlterationCommand(
      'test-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      10,
      [],
      []
    );
    (alterationsRepository.getAlterationById as jest.Mock).mockResolvedValue(
      undefined
    );
    await expect(updateAlterationUseCase.execute(command)).rejects.toThrow(
      new NotFoundException('Alteration not found')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new UpdateAlterationCommand(
      'test-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      10,
      [],
      []
    );
    (alterationsRepository.getAlterationById as jest.Mock).mockResolvedValue({
      id: 'test-id',
    } as Alteration);
    (alterationsRepository.updateAlteration as jest.Mock).mockRejectedValue(
      new Error('DB Error')
    );
    await expect(updateAlterationUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
