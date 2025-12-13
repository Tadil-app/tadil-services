import {
  FileStorageService,
  InfrastructureException,
  InvalidCommandException,
  NotFoundException,
} from '@tadil-common';
import { ModelsRepository } from './models.repository';

export class DeleteModelUseCase {
  private _modelsRepository: ModelsRepository;
  private _fileStorageService: FileStorageService;

  constructor(
    modelsRepository: ModelsRepository,
    fileStorageService: FileStorageService
  ) {
    this._modelsRepository = modelsRepository;
    this._fileStorageService = fileStorageService;
  }

  async execute(deleteModelCommand: DeleteModelCommand): Promise<void> {
    if (!deleteModelCommand.modelId) {
      throw new InvalidCommandException('Model ID is required');
    }

    const model = await this._modelsRepository.getModelById(
      deleteModelCommand.modelId
    );
    if (!model) {
      throw new NotFoundException('Model not found');
    }

    try {
      await this._modelsRepository.deleteModel(deleteModelCommand.modelId);

      try {
        await Promise.all(
          model.images.map(async (image) => {
            await this._fileStorageService.deleteFile(image.fileId);
          })
        );
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(
          `Error deleting model: ${error.message}`
        );
    }
  }
}

export class DeleteModelCommand {
  readonly modelId: string;
  constructor(modelId: string) {
    this.modelId = modelId;
  }
}
