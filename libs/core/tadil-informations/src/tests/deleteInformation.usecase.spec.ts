
import {
  DeleteInformationCommand,
  DeleteInformationUseCase,
} from '../application/deleteInformation.usecase';
import { InformationsRepository } from '../application/information.repository';
import {
  InvalidCommandException,
  NotFoundException,
} from '@tadil-common';
import { Information } from '../application/information.model';

describe('DeleteInformationUseCase', () => {
  let informationsRepository: InformationsRepository;
  let deleteInformationUseCase: DeleteInformationUseCase;

  beforeEach(() => {
    informationsRepository = {
      createInformation: jest.fn(),
      getInformationById: jest.fn(),
      updateInformation: jest.fn(),
      deleteInformation: jest.fn(),
    };
    deleteInformationUseCase = new DeleteInformationUseCase(
      informationsRepository
    );
  });

  it('should delete an information successfully', async () => {
    const command = new DeleteInformationCommand('test-id');
    (informationsRepository.getInformationById as jest.Mock).mockResolvedValue({
      id: 'test-id',
    } as Information);
    await deleteInformationUseCase.execute(command);
    expect(informationsRepository.deleteInformation).toHaveBeenCalledWith(
      'test-id'
    );
  });

  it('should throw InvalidCommandException if informationId is not provided', async () => {
    const command = new DeleteInformationCommand('');
    await expect(deleteInformationUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Information ID is required')
    );
  });

  it('should throw NotFoundException if information is not found', async () => {
    const command = new DeleteInformationCommand('test-id');
    (informationsRepository.getInformationById as jest.Mock).mockResolvedValue(
      undefined
    );
    await expect(deleteInformationUseCase.execute(command)).rejects.toThrow(
      new NotFoundException('Information not found')
    );
  });
});
