
import {
  CreateInformationCommand,
  CreateInformationUseCase,
} from '../application/createInformation.usecase';
import { InformationsRepository } from '../application/information.repository';
import {
  InvalidCommandException,
  InfrastructureException,
} from '@tadil-common';
import { InformationType } from '../application/information.model';

jest.mock('uuid', () => ({ v4: () => 'mocked-uuid' }));

describe('CreateInformationUseCase', () => {
  let informationsRepository: InformationsRepository;
  let createInformationUseCase: CreateInformationUseCase;

  beforeEach(() => {
    informationsRepository = {
      createInformation: jest.fn(),
      getInformationById: jest.fn(),
      updateInformation: jest.fn(),
      deleteInformation: jest.fn(),
    };
    createInformationUseCase = new CreateInformationUseCase(
      informationsRepository
    );
  });

  it('should create an information successfully', async () => {
    const command = new CreateInformationCommand(
      'test',
      'test',
      'test',
      'test',
      'test',
      true,
      InformationType.TEXT,
      []
    );
    await createInformationUseCase.execute(command);
    expect(informationsRepository.createInformation).toHaveBeenCalled();
  });

  it('should throw InvalidCommandException if englishName is not provided', async () => {
    const command = new CreateInformationCommand(
      '',
      'test',
      'test',
      'test',
      'test',
      true,
      InformationType.TEXT,
      []
    );
    await expect(createInformationUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Information English Name is required')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new CreateInformationCommand(
      'test',
      'test',
      'test',
      'test',
      'test',
      true,
      InformationType.TEXT,
      []
    );
    (informationsRepository.createInformation as jest.Mock).mockRejectedValue(
      new Error('DB Error')
    );
    await expect(createInformationUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
