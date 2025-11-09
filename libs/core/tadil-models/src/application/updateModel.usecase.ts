import { ModelsRepository } from './models.repository';
import {
  InfrastructureException,
  InvalidCommandException,
  NotFoundException,
} from '@tadil-common';

export class UpdateModelUseCase {
  private _modelsRepository: ModelsRepository;

  constructor(modelsRepository: ModelsRepository) {
    this._modelsRepository = modelsRepository;
  }

  async execute(updateModelCommand: UpdateModelCommand): Promise<void> {
    if (!updateModelCommand.id) {
      throw new InvalidCommandException('Model ID is required');
    }
    if (!updateModelCommand.englishName) {
      throw new InvalidCommandException('Model English Name is required');
    }
    if (!updateModelCommand.arabicName) {
      throw new InvalidCommandException('Model Arabic Name is required');
    }
    if (!updateModelCommand.hindiName) {
      throw new InvalidCommandException('Model Hindi Name is required');
    }
    if (!updateModelCommand.urduName) {
      throw new InvalidCommandException('Model Urdu Name is required');
    }
    if (!updateModelCommand.bengaliName) {
      throw new InvalidCommandException('Model Bengali Name is required');
    }

    const model = await this._modelsRepository.getModelById(
      updateModelCommand.id
    );
    if (!model) {
      throw new NotFoundException('Model not found');
    }

    try {
      try {
        await this._modelsRepository.updateModel({
          id: updateModelCommand.id,
          englishName: updateModelCommand.englishName,
          arabicName: updateModelCommand.arabicName,
          hindiName: updateModelCommand.hindiName,
          urduName: updateModelCommand.urduName,
          bengaliName: updateModelCommand.bengaliName,
        });
      } catch (error: unknown) {
        if (error instanceof Error)
          throw new InfrastructureException(error.message);
        else throw error;
      }
    } catch (uploadError: unknown) {
      if (uploadError instanceof Error)
        throw new InfrastructureException(uploadError.message);
      else throw uploadError;
    }
  }
}

export class UpdateModelCommand {
  readonly id: string;
  readonly englishName: string;
  readonly arabicName: string;
  readonly hindiName: string;
  readonly urduName: string;
  readonly bengaliName: string;
  constructor(
    id: string,
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string
  ) {
    this.id = id;
    this.englishName = englishName;
    this.arabicName = arabicName;
    this.hindiName = hindiName;
    this.urduName = urduName;
    this.bengaliName = bengaliName;
  }
}
