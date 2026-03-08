
import {
  CreateModelCommand,
  CreateModelUseCase,
} from '../application/createModel.usecase';
import { ModelsRepository } from '../application/models.repository';
import {
  InvalidCommandException,
  InfrastructureException,
} from '@tadil-common';
import { ModelCategory } from '../application/model.model';

jest.mock('uuid', () => ({ v4: () => 'mocked-uuid' }));

describe('CreateModelUseCase', () => {
  let modelsRepository: ModelsRepository;
  let createModelUseCase: CreateModelUseCase;

  beforeEach(() => {
    modelsRepository = {
      createModel: jest.fn(),
      getModelById: jest.fn(),
      updateModel: jest.fn(),
      deleteModel: jest.fn(),
      addModelImage: jest.fn(),
      deleteModelImage: jest.fn(),
      getModelImageById: jest.fn(),
      addSection: jest.fn(),
      deleteSection: jest.fn(),
      getSectionById: jest.fn(),
      updateSection: jest.fn(),
    };
    createModelUseCase = new CreateModelUseCase(modelsRepository);
  });

  it('should create a model successfully', async () => {
    const command = new CreateModelCommand(
      'test',
      'test',
      'test',
      'test',
      'test',
      ModelCategory.MEN
    );
    await createModelUseCase.execute(command);
    expect(modelsRepository.createModel).toHaveBeenCalled();
  });

  it('should throw InvalidCommandException if englishName is not provided', async () => {
    const command = new CreateModelCommand(
      '',
      'test',
      'test',
      'test',
      'test',
      ModelCategory.MEN
    );
    await expect(createModelUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Model English Name is required')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new CreateModelCommand(
      'test',
      'test',
      'test',
      'test',
      'test',
      ModelCategory.MEN
    );
    (modelsRepository.createModel as jest.Mock).mockRejectedValue(
      new Error('DB Error')
    );
    await expect(createModelUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
