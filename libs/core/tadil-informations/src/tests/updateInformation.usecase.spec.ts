
import {
  UpdateInformationCommand,
  UpdateInformationUseCase,
} from '../application/updateInformation.usecase';
import { InformationsRepository } from '../application/information.repository';
import {
  InvalidCommandException,
  NotFoundException,
  InfrastructureException,
} from '@tadil-common';
import { Information, InformationType } from '../application/information.model';

describe('UpdateInformationUseCase', () => {
  let informationsRepository: InformationsRepository;
  let updateInformationUseCase: UpdateInformationUseCase;

  beforeEach(() => {
    informationsRepository = {
      createInformation: jest.fn(),
      getInformationById: jest.fn(),
      updateInformation: jest.fn(),
      deleteInformation: jest.fn(),
    };
    updateInformationUseCase = new UpdateInformationUseCase(
      informationsRepository
    );
  });

  it('should update an information successfully', async () => {
    const command = new UpdateInformationCommand(
      'test-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      true,
      InformationType.TEXT,
      []
    );
    (informationsRepository.getInformationById as jest.Mock).mockResolvedValue({
      id: 'test-id',
    } as Information);
    await updateInformationUseCase.execute(command);
    expect(informationsRepository.updateInformation).toHaveBeenCalledWith(
      command
    );
  });

  it('should throw InvalidCommandException if id is not provided', async () => {
    const command = new UpdateInformationCommand(
      '',
      'test',
      'test',
      'test',
      'test',
      'test',
      true,
      InformationType.TEXT,
      []
    );
    await expect(updateInformationUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Information Id is required')
    );
  });

  it('should throw NotFoundException if information is not found', async () => {
    const command = new UpdateInformationCommand(
      'test-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      true,
      InformationType.TEXT,
      []
    );
    (informationsRepository.getInformationById as jest.Mock).mockResolvedValue(
      undefined
    );
    await expect(updateInformationUseCase.execute(command)).rejects.toThrow(
      new NotFoundException('Information not found')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new UpdateInformationCommand(
      'test-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      true,
      InformationType.TEXT,
      []
    );
    (informationsRepository.getInformationById as jest.Mock).mockResolvedValue({
      id: 'test-id',
    } as Information);
    (informationsRepository.updateInformation as jest.Mock).mockRejectedValue(
      new Error('DB Error')
    );
    await expect(updateInformationUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
