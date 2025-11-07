import { InvalidCommandException, NotFoundException } from '@tadil-common';
import { ModelsRepository } from './models.repository';

export class DeleteModelUseCase {
  constructor(private _modelsRepository: ModelsRepository) {}

  async execute(deleteModelCommand: DeleteModelCommand): Promise<void> {
    if(!deleteModelCommand.modelId) {
      throw new InvalidCommandException('Model ID is required');
    }

    const model = await this._modelsRepository.getModelById(
      deleteModelCommand.modelId
    )
    if(!model) {
      throw new NotFoundException('Model not found');
    }
    await this._modelsRepository.deleteModel(deleteModelCommand.modelId);
  }
}

export class DeleteModelCommand {
  readonly modelId: string;
  constructor(modelId: string) {
    this.modelId = modelId;
  }
}
