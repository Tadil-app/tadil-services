import {
  InfrastructureException,
  InvalidCommandException,
  NotFoundException,
} from '@tadil-common';
import { ModelsRepository } from './models.repository';
import { Point } from './model.model';

export class UpdateSectionUseCase {
  private _modelsRepository: ModelsRepository;
  constructor(_modelsRepository: ModelsRepository) {
    this._modelsRepository = _modelsRepository;
  }

  async execute(updateSectionCommand: UpdateSectionCommand): Promise<void> {
    if (!updateSectionCommand.id) {
      throw new InvalidCommandException('Section ID is required');
    }
    if (!updateSectionCommand.englishName) {
      throw new InvalidCommandException('English name is required');
    }
    if (!updateSectionCommand.arabicName) {
      throw new InvalidCommandException('Arabic name is required');
    }
    if (!updateSectionCommand.hindiName) {
      throw new InvalidCommandException('Hindi name is required');
    }
    if (!updateSectionCommand.urduName) {
      throw new InvalidCommandException('Urdu name is required');
    }
    if (!updateSectionCommand.bengaliName) {
      throw new InvalidCommandException('Bengali name is required');
    }
    if (
      !updateSectionCommand.coordinates ||
      updateSectionCommand.coordinates.length === 0
    ) {
      throw new InvalidCommandException('Coordinates are required');
    }

    const section = await this._modelsRepository.getSectionById(
      updateSectionCommand.id
    );
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    try {
      await this._modelsRepository.updateSection({
        ...section,
        ...updateSectionCommand,
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}

export class UpdateSectionCommand {
  readonly id: string;
  readonly englishName: string;
  readonly arabicName: string;
  readonly hindiName: string;
  readonly urduName: string;
  readonly bengaliName: string;
  readonly coordinates: Point[];
  readonly alterations: string[];

  constructor(
    id: string,
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string,
    coordinates: Point[],
    alterations: string[]
  ) {
    this.id = id;
    this.englishName = englishName;
    this.arabicName = arabicName;
    this.hindiName = hindiName;
    this.urduName = urduName;
    this.bengaliName = bengaliName;
    this.coordinates = coordinates;
    this.alterations = alterations;
  }
}
