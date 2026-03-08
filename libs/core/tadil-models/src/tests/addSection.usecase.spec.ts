
import {
  AddSectionCommand,
  AddSectionUseCase,
} from '../application/addSection.usecase';
import { ModelsRepository } from '../application/models.repository';
import {
  InvalidCommandException,
  NotFoundException,
  InfrastructureException,
} from '@tadil-common';
import { ModelImage } from '../application/model.model';

jest.mock('uuid', () => ({ v4: () => 'mocked-uuid' }));

describe('AddSectionUseCase', () => {
  let modelsRepository: ModelsRepository;
  let addSectionUseCase: AddSectionUseCase;

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
    addSectionUseCase = new AddSectionUseCase(modelsRepository);
  });

  it('should add a section successfully', async () => {
    const command = new AddSectionCommand(
      'image-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      [{ x: 1, y: 1 }],
      []
    );
    (modelsRepository.getModelImageById as jest.Mock).mockResolvedValue({
      id: 'image-id',
    } as ModelImage);
    await addSectionUseCase.execute(command);
    expect(modelsRepository.addSection).toHaveBeenCalled();
  });

  it('should throw InvalidCommandException if modelImageId is not provided', async () => {
    const command = new AddSectionCommand(
      '',
      'test',
      'test',
      'test',
      'test',
      'test',
      [{ x: 1, y: 1 }],
      []
    );
    await expect(addSectionUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Model Image ID is required')
    );
  });

  it('should throw InvalidCommandException if englishName is not provided', async () => {
    const command = new AddSectionCommand(
      'image-id',
      '',
      'test',
      'test',
      'test',
      'test',
      [{ x: 1, y: 1 }],
      []
    );
    await expect(addSectionUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('English name is required')
    );
  });

  it('should throw InvalidCommandException if coordinates are not provided', async () => {
    const command = new AddSectionCommand(
      'image-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      [],
      []
    );
    await expect(addSectionUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Coordinates are required')
    );
  });

  it('should throw NotFoundException if model image is not found', async () => {
    const command = new AddSectionCommand(
      'image-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      [{ x: 1, y: 1 }],
      []
    );
    (modelsRepository.getModelImageById as jest.Mock).mockResolvedValue(
      undefined
    );
    await expect(addSectionUseCase.execute(command)).rejects.toThrow(
      new NotFoundException('Model Image not found')
    );
  });

  it('should throw InfrastructureException if repository throws error', async () => {
    const command = new AddSectionCommand(
      'image-id',
      'test',
      'test',
      'test',
      'test',
      'test',
      [{ x: 1, y: 1 }],
      []
    );
    (modelsRepository.getModelImageById as jest.Mock).mockResolvedValue({
      id: 'image-id',
    } as ModelImage);
    (modelsRepository.addSection as jest.Mock).mockRejectedValue(new Error('DB Error'));
    await expect(addSectionUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
