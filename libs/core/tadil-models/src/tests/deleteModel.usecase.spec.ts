
import {
  DeleteModelCommand,
  DeleteModelUseCase,
} from '../application/deleteModel.usecase';
import { ModelsRepository } from '../application/models.repository';
import {
  FileStorageService,
  InvalidCommandException,
  NotFoundException,
  InfrastructureException,
} from '@tadil-common';
import { Model } from '../application/model.model';

describe('DeleteModelUseCase', () => {
  let modelsRepository: ModelsRepository;
  let fileStorageService: FileStorageService;
  let deleteModelUseCase: DeleteModelUseCase;

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
    deleteModelUseCase = new DeleteModelUseCase(
      modelsRepository,
      fileStorageService
    );
  });

  it('should delete a model and its images successfully', async () => {
    const command = new DeleteModelCommand('model-id');
    (modelsRepository.getModelById as jest.Mock).mockResolvedValue({
      id: 'model-id',
      images: [{ fileId: 'file1' }, { fileId: 'file2' }],
    } as Model);
    await deleteModelUseCase.execute(command);
    expect(modelsRepository.deleteModel).toHaveBeenCalledWith('model-id');
    expect(fileStorageService.deleteFile).toHaveBeenCalledTimes(2);
  });

  it('should throw InvalidCommandException if modelId is not provided', async () => {
    const command = new DeleteModelCommand('');
    await expect(deleteModelUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Model ID is required')
    );
  });

  it('should throw NotFoundException if model is not found', async () => {
    const command = new DeleteModelCommand('model-id');
    (modelsRepository.getModelById as jest.Mock).mockResolvedValue(undefined);
    await expect(deleteModelUseCase.execute(command)).rejects.toThrow(
      new NotFoundException('Model not found')
    );
  });

  it('should throw InfrastructureException if modelsRepository.deleteModel throws error', async () => {
    const command = new DeleteModelCommand('model-id');
    (modelsRepository.getModelById as jest.Mock).mockResolvedValue({
      id: 'model-id',
      images: [],
    } as Model);
    (modelsRepository.deleteModel as jest.Mock).mockRejectedValue(new Error('DB Error'));
    await expect(deleteModelUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('Error deleting model: DB Error')
    );
  });

  it('should attempt to delete associated files even if file deletion fails, and not re-throw the error', async () => {
    const command = new DeleteModelCommand('model-id');
    (modelsRepository.getModelById as jest.Mock).mockResolvedValue({
      id: 'model-id',
      images: [{ fileId: 'file1' }],
    } as Model);
    (modelsRepository.deleteModel as jest.Mock).mockResolvedValue(undefined); // Ensure deleteModel is successful
    (fileStorageService.deleteFile as jest.Mock).mockRejectedValue(new Error('File Deletion Error'));
    // The use case catches this error internally and logs it, but still completes the transaction successfully regarding model deletion
    // So the outer expect should not throw
    await deleteModelUseCase.execute(command);
    // However, it's good to check if the deleteFile was called
    expect(fileStorageService.deleteFile).toHaveBeenCalledWith('file1');
  });
});
