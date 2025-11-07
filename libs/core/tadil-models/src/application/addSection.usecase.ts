import {
  InfrastructureException,
  InvalidCommandException,
  NotFoundException,
} from '@tadil-common';
import { ModelsRepository } from './models.repository';
import { v4 as uuidv4 } from 'uuid';
import { Point } from './model.model';

export class AddSectionUseCase {
  private _modelsRepository: ModelsRepository;
  constructor(_modelsRepository: ModelsRepository) {
    this._modelsRepository = _modelsRepository;
  }

  async execute(addSectionCommand: AddSectionCommand): Promise<void> {
    if (!addSectionCommand.modelId) {
      throw new InvalidCommandException('Model ID is required');
    }
    if (!addSectionCommand.englishName) {
      throw new InvalidCommandException('English name is required');
    }
    if (!addSectionCommand.arabicName) {
      throw new InvalidCommandException('Arabic name is required');
    }
    if (!addSectionCommand.hindiName) {
      throw new InvalidCommandException('Hindi name is required');
    }
    if (!addSectionCommand.urduName) {
      throw new InvalidCommandException('Urdu name is required');
    }
    if (!addSectionCommand.bengaliName) {
      throw new InvalidCommandException('Bengali name is required');
    }
    if (
      !addSectionCommand.coordinates ||
      addSectionCommand.coordinates.length === 0
    ) {
      throw new InvalidCommandException('Coordinates are required');
    }

    const model = await this._modelsRepository.getModelById(
      addSectionCommand.modelId
    );
    if (!model) {
      throw new NotFoundException('Model not found');
    }
    
    try {
      const nexSectionId = uuidv4();
      await this._modelsRepository.addSection({
        id: nexSectionId,
        ...addSectionCommand,
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}

export class AddSectionCommand {
  readonly modelId: string;
  readonly englishName: string;
  readonly arabicName: string;
  readonly hindiName: string;
  readonly urduName: string;
  readonly bengaliName: string;
  readonly coordinates: Point[];

  constructor(
    modelId: string,
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string,
    coordinates: Point[]
  ) {
    this.modelId = modelId;
    this.englishName = englishName;
    this.arabicName = arabicName;
    this.hindiName = hindiName;
    this.urduName = urduName;
    this.bengaliName = bengaliName;
    this.coordinates = coordinates;
  }
}
