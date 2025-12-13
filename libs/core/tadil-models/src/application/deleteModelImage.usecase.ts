import { FileStorageService, InfrastructureException } from '@tadil-common';
import { ModelsRepository } from './models.repository';

export class DeleteModelImageUseCase {
  private _modelsRepository: ModelsRepository;
  private _fileStorageService: FileStorageService;
  constructor(
    modelsRepository: ModelsRepository,
    fileStorageService: FileStorageService
  ) {
    this._modelsRepository = modelsRepository;
    this._fileStorageService = fileStorageService;
  }

  async execute(
    deleteModelImageCommand: DeleteModelImageCommand
  ): Promise<void> {
    if (!deleteModelImageCommand.imageId) {
      throw new Error('Image ID is required');
    }

    const image = await this._modelsRepository.getModelImageById(
      deleteModelImageCommand.imageId
    );
    if (!image) {
      throw new Error('Image not found');
    }

    try {
      await this._modelsRepository.deleteModelImage(
        deleteModelImageCommand.imageId
      );

      try {
        await this._fileStorageService.deleteFile(image.fileId);
      } catch (error) {
        console.error(error);
      }
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(
          `Error deleting model: ${error.message}`
        );
    }
  }
}

export class DeleteModelImageCommand {
  readonly imageId: string;
  constructor(imageId: string) {
    this.imageId = imageId;
  }
}
