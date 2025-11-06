import { InvalidCommandException } from '@tadil-common';
import { SectionsRepository } from './sections.repository.js';
import { v4 as uuidv4 } from 'uuid';

export class CreateSectionUseCase {
  private _sectionsRepository: SectionsRepository;
  constructor(sectionsRepository: SectionsRepository) {
    this._sectionsRepository = sectionsRepository;
  }

  async execute(createSectionCommand: CreateSectionCommand): Promise<void> {
    if (!createSectionCommand) {
      throw new InvalidCommandException('Invalid section data');
    }
    if (!createSectionCommand.englishName) {
      throw new InvalidCommandException('English name is required');
    }
    if (!createSectionCommand.arabicName) {
      throw new InvalidCommandException('Arabic name is required');
    }
    if (!createSectionCommand.hindiName) {
      throw new InvalidCommandException('Hindi name is required');
    }
    if (!createSectionCommand.urduName) {
      throw new InvalidCommandException('Urdu name is required');
    }
    if (!createSectionCommand.bengaliName) {
      throw new InvalidCommandException('Bengali name is required');
    }
    const nexSectionId = uuidv4();
    await this._sectionsRepository.createSection({
      id: nexSectionId,
      ...createSectionCommand,
    });
  }
}

export class CreateSectionCommand {
  readonly englishName: string;
  readonly arabicName: string;
  readonly hindiName: string;
  readonly urduName: string;
  readonly bengaliName: string;
  constructor(
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string
  ) {
    this.englishName = englishName;
    this.arabicName = arabicName;
    this.hindiName = hindiName;
    this.urduName = urduName;
    this.bengaliName = bengaliName;
  }
}
