import { ModelsRepository } from './models.repository';
import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { v4 as uuidv4 } from 'uuid';

export class CreateModelUseCase {
  private _modelsRepository: ModelsRepository;

  constructor(modelsRepository: ModelsRepository) {
    this._modelsRepository = modelsRepository;
  }

  async execute(createModelCommand: CreateModelCommand): Promise<string> {
    if (!createModelCommand.englishName) {
      throw new InvalidCommandException('Model English Name is required');
    }
    if (!createModelCommand.arabicName) {
      throw new InvalidCommandException('Model Arabic Name is required');
    }
    if (!createModelCommand.hindiName) {
      throw new InvalidCommandException('Model Hindi Name is required');
    }
    if (!createModelCommand.urduName) {
      throw new InvalidCommandException('Model Urdu Name is required');
    }
    if (!createModelCommand.bengaliName) {
      throw new InvalidCommandException('Model Bengali Name is required');
    }

    try {
      const newModelId = uuidv4();
      await this._modelsRepository.createModel({
        id: newModelId,
        englishName: createModelCommand.englishName,
        arabicName: createModelCommand.arabicName,
        hindiName: createModelCommand.hindiName,
        urduName: createModelCommand.urduName,
        bengaliName: createModelCommand.bengaliName,
        category: createModelCommand.category,
      });

      return newModelId;
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}

export class CreateModelCommand {
  readonly englishName: string;
  readonly arabicName: string;
  readonly hindiName: string;
  readonly urduName: string;
  readonly bengaliName: string;
  readonly category?: string;
  constructor(
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string,
    category?: string
  ) {
    this.englishName = englishName;
    this.arabicName = arabicName;
    this.hindiName = hindiName;
    this.urduName = urduName;
    this.bengaliName = bengaliName;
    this.category = category;
  }
}
