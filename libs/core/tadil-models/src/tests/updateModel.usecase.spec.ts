
import {
  UpdateModelCommand,
  UpdateModelUseCase,
} from '../application/updateModel.usecase';
import { ModelsRepository } from '../application/models.repository';
import {
  InvalidCommandException,
  NotFoundException,
  InfrastructureException,
} from '@tadil-common';
import { Model, ModelCategory } from '../application/model.model';

describe('UpdateModelUseCase', () => {
  let modelsRepository: ModelsRepository;
  let updateModelUseCase: UpdateModelUseCase;

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
    updateModelUseCase = new UpdateModelUseCase(modelsRepository);
  });

  it('should update a model successfully', async () => {
    const command = new UpdateModelCommand(
      'model-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      ModelCategory.MEN
    );
    (modelsRepository.getModelById as jest.Mock).mockResolvedValue({
      id: 'model-id',
    } as Model);
    await updateModelUseCase.execute(command);
    expect(modelsRepository.updateModel).toHaveBeenCalled();
  });

  it('should throw InvalidCommandException if id is not provided', async () => {
    const command = new UpdateModelCommand(
      '',
      'test',
      'test',
      'test',
      'test',
      'test',
      ModelCategory.MEN
    );
    await expect(updateModelUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Model ID is required')
    );
  });

  it('should throw NotFoundException if model not found', async () => {
    const command = new UpdateModelCommand(
      'model-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      ModelCategory.MEN
    );
    (modelsRepository.getModelById as jest.Mock).mockResolvedValue(undefined);
    await expect(updateModelUseCase.execute(command)).rejects.toThrow(
      new NotFoundException('Model not found')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new UpdateModelCommand(
      'model-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      ModelCategory.MEN
    );
    (modelsRepository.getModelById as jest.Mock).mockResolvedValue({
      id: 'model-id',
    } as Model);
    (modelsRepository.updateModel as jest.Mock).mockRejectedValue(new Error('DB Error'));
    await expect(updateModelUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
