
import {
  AddModelImageCommand,
  AddModelImageUseCase,
} from '../application/addModelImage.usecase';
import { ModelsRepository } from '../application/models.repository';
import {
  FileStorageService,
  ReadableFile,
  InvalidCommandException,
  NotFoundException,
  InfrastructureException,
} from '@tadil-common';
import { Model } from '../application/model.model';

jest.mock('uuid', () => ({ v4: () => 'mocked-uuid' }));

describe('AddModelImageUseCase', () => {
  let modelsRepository: ModelsRepository;
  let fileStorageService: FileStorageService;
  let addModelImageUseCase: AddModelImageUseCase;

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
    fileStorageService = {
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
      downloadFile: jest.fn(),
      getFileUrl: jest.fn(),
    };
    addModelImageUseCase = new AddModelImageUseCase(
      modelsRepository,
      fileStorageService
    );
  });

  it('should add a model image successfully', async () => {
    const command = new AddModelImageCommand('model-id', {
      path: 'test.jpg',
    } as ReadableFile);
    (modelsRepository.getModelById as jest.Mock).mockResolvedValue({
      id: 'model-id',
    } as Model);
    await addModelImageUseCase.execute(command);
    expect(fileStorageService.uploadFile).toHaveBeenCalled();
    expect(modelsRepository.addModelImage).toHaveBeenCalled();
  });

  it('should throw InvalidCommandException if modelId is not provided', async () => {
    const command = new AddModelImageCommand('', { path: 'test.jpg' } as ReadableFile);
    await expect(addModelImageUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Model ID is required')
    );
  });

  it('should throw InvalidCommandException if imageFile is not provided', async () => {
    const command = new AddModelImageCommand('model-id', undefined as any);
    await expect(addModelImageUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Image is required')
    );
  });

  it('should throw NotFoundException if model is not found', async () => {
    const command = new AddModelImageCommand('model-id', { path: 'test.jpg' } as ReadableFile);
    (modelsRepository.getModelById as jest.Mock).mockResolvedValue(undefined);
    await expect(addModelImageUseCase.execute(command)).rejects.toThrow(
      new NotFoundException('Model not found')
    );
  });

  it('should throw InfrastructureException if fileStorageService.uploadFile throws error', async () => {
    const command = new AddModelImageCommand('model-id', { path: 'test.jpg' } as ReadableFile);
    (modelsRepository.getModelById as jest.Mock).mockResolvedValue({
      id: 'model-id',
    } as Model);
    (fileStorageService.uploadFile as jest.Mock).mockRejectedValue(new Error('Upload Error'));
    await expect(addModelImageUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('Upload Error')
    );
  });

  it('should throw InfrastructureException if modelsRepository.addModelImage throws error', async () => {
    const command = new AddModelImageCommand('model-id', { path: 'test.jpg' } as ReadableFile);
    (modelsRepository.getModelById as jest.Mock).mockResolvedValue({
      id: 'model-id',
    } as Model);
    (modelsRepository.addModelImage as jest.Mock).mockRejectedValue(new Error('DB Error'));
    await expect(addModelImageUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('DB Error')
    );
  });
});
