
import {
  DeleteExtraCommand,
  DeleteExtraUseCase,
} from '../application/deleteExtra.usecase';
import { ExtrasRepository } from '../application/extras.repository';
import {
  InvalidCommandException,
  NotFoundException,
} from '@tadil-common';
import { Extra } from '../application/extra.model';

describe('DeleteExtraUseCase', () => {
  let extrasRepository: ExtrasRepository;
  let deleteExtraUseCase: DeleteExtraUseCase;

  beforeEach(() => {
    extrasRepository = {
      createExtra: jest.fn(),
      getExtraById: jest.fn(),
      updateExtra: jest.fn(),
      deleteExtra: jest.fn(),
    };
    deleteExtraUseCase = new DeleteExtraUseCase(extrasRepository);
  });

  it('should delete an extra successfully', async () => {
    const command = new DeleteExtraCommand('test-id');
    (extrasRepository.getExtraById as jest.Mock).mockResolvedValue({
      id: 'test-id',
    } as Extra);
    await deleteExtraUseCase.execute(command);
    expect(extrasRepository.deleteExtra).toHaveBeenCalledWith('test-id');
  });

  it('should throw InvalidCommandException if extraId is not provided', async () => {
    const command = new DeleteExtraCommand('');
    await expect(deleteExtraUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Extra ID is required')
    );
  });

  it('should throw NotFoundException if extra is not found', async () => {
    const command = new DeleteExtraCommand('test-id');
    (extrasRepository.getExtraById as jest.Mock).mockResolvedValue(undefined);
    await expect(deleteExtraUseCase.execute(command)).rejects.toThrow(
      new NotFoundException('Extra not found')
    );
  });
});
