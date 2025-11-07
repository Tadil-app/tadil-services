import {
  FileStorageService,
  InfrastructureException,
  InvalidCommandException,
  NotFoundException,
} from '@tadil-common';
import { ModelsRepository } from './models.repository';

export class DeleteModelUseCase {
  constructor(
    private _modelsRepository: ModelsRepository,
    private _fileStorageService: FileStorageService
  ) {}

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
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(
          `Error deleting model: ${error.message}`
        );
    }
    try {
      await this._fileStorageService.deleteFile(model.imageFileId);
    } catch {
      throw new InfrastructureException(
        `Error deleting file: ${model.imageFileId}`
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
