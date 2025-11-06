import { InvalidCommandException } from '@tadil-common';
import { SectionsRepository } from './sections.repository';

export class UpdateSectionUseCase {
  private _sectionsRepository: SectionsRepository;
  constructor(sectionsRepository: SectionsRepository) {
    this._sectionsRepository = sectionsRepository;
  }

  async execute(updateSectionCommand: UpdateSectionCommand): Promise<void> {
    if (!updateSectionCommand.id) {
      throw new InvalidCommandException('Section ID is required');
    }
    if (!updateSectionCommand) {
      throw new InvalidCommandException('Invalid section data');
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

    const section = await this._sectionsRepository.getSectionById(
      updateSectionCommand.id
    );
    if (!section) {
      throw new InvalidCommandException('Section not found');
    }

    await this._sectionsRepository.updateSection(updateSectionCommand);
  }
}

export class UpdateSectionCommand {
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
