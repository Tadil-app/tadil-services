
import {
  DeleteModelImageCommand,
  DeleteModelImageUseCase,
} from '../application/deleteModelImage.usecase';
import { ModelsRepository } from '../application/models.repository';
import {
  FileStorageService,
  InvalidCommandException,
  NotFoundException,
  InfrastructureException,
} from '@tadil-common';
import { ModelImage } from '../application/model.model';

describe('DeleteModelImageUseCase', () => {
  let modelsRepository: ModelsRepository;
  let fileStorageService: FileStorageService;
  let deleteModelImageUseCase: DeleteModelImageUseCase;

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
    deleteModelImageUseCase = new DeleteModelImageUseCase(
      modelsRepository,
      fileStorageService
    );
  });

  it('should delete a model image successfully', async () => {
    const command = new DeleteModelImageCommand('image-id');
    (modelsRepository.getModelImageById as jest.Mock).mockResolvedValue({
      id: 'image-id',
      fileId: 'file-id',
    } as ModelImage);
    await deleteModelImageUseCase.execute(command);
    expect(modelsRepository.deleteModelImage).toHaveBeenCalledWith('image-id');
    expect(fileStorageService.deleteFile).toHaveBeenCalledWith('file-id');
  });

  it('should throw InvalidCommandException if imageId is not provided', async () => {
    const command = new DeleteModelImageCommand('');
    await expect(deleteModelImageUseCase.execute(command)).rejects.toThrow(
      new InvalidCommandException('Image ID is required')
    );
  });

  it('should throw NotFoundException if image is not found', async () => {
    const command = new DeleteModelImageCommand('image-id');
    (modelsRepository.getModelImageById as jest.Mock).mockResolvedValue(
      undefined
    );
    await expect(deleteModelImageUseCase.execute(command)).rejects.toThrow(
      new NotFoundException('Image not found')
    );
  });

  it('should throw InfrastructureException if modelsRepository.deleteModelImage throws error', async () => {
    const command = new DeleteModelImageCommand('image-id');
    (modelsRepository.getModelImageById as jest.Mock).mockResolvedValue({
      id: 'image-id',
      fileId: 'file-id',
    } as ModelImage);
    (modelsRepository.deleteModelImage as jest.Mock).mockRejectedValue(
      new Error('DB Error')
    );
    await expect(deleteModelImageUseCase.execute(command)).rejects.toThrow(
      new InfrastructureException('Error deleting model: DB Error')
    );
  });

  it('should attempt to delete the file even if file deletion fails, and not re-throw the error', async () => {
    const command = new DeleteModelImageCommand('image-id');
    (modelsRepository.getModelImageById as jest.Mock).mockResolvedValue({
      id: 'image-id',
      fileId: 'file-id',
    } as ModelImage);
    (modelsRepository.deleteModelImage as jest.Mock).mockResolvedValue(
      undefined
    );
    (fileStorageService.deleteFile as jest.Mock).mockRejectedValue(
      new Error('File Deletion Error')
    );
    await deleteModelImageUseCase.execute(command);
    expect(fileStorageService.deleteFile).toHaveBeenCalledWith('file-id');
  });
});
