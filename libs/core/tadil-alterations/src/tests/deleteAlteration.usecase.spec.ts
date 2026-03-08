
import {
  DeleteAlterationCommand,
  DeleteAlterationUseCase,
} from '../application/deleteAlteration.usecase';
import { AlterationsRepository } from '../application/alterations.repository';
import {
  InvalidCommandException,
  NotFoundException,
} from '@tadil-common';
import { Alteration } from '../application/alteration.model';

describe('DeleteAlterationUseCase', () => {
  let alterationsRepository: AlterationsRepository;
  let deleteAlterationUseCase: DeleteAlterationUseCase;

  beforeEach(() => {
    alterationsRepository = {
      createAlteration: jest.fn(),
      getAlterationById: jest.fn(),
      updateAlteration: jest.fn(),
      deleteAlteration: jest.fn(),
    };
    deleteAlterationUseCase = new DeleteAlterationUseCase(
      alterationsRepository
    );
  });

  it('should delete an alteration successfully', async () => {
    const command = new DeleteAlterationCommand('test-id');
    (alterationsRepository.getAlterationById as jest.Mock).mockResolvedValue({
      id: 'test-id',
    } as Alteration);
    await deleteAlterationUseCase.execute(command);
    expect(alterationsRepository.deleteAlteration).toHaveBeenCalledWith(
      'test-id'
    );
  });

  it('should throw InvalidCommandException if alterationId is not provided', async () => {
    const command = new DeleteAlterationCommand('');
    await expect(deleteAlterationUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Alteration ID is required')
    );
  });

  it('should throw NotFoundException if alteration is not found', async () => {
    const command = new DeleteAlterationCommand('test-id');
    (alterationsRepository.getAlterationById as jest.Mock).mockResolvedValue(
      undefined
    );
    await expect(deleteAlterationUseCase.execute(command)).rejects.toThrow(
      new NotFoundException('Alteration not found')
    );
  });
});
