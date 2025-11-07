import { InvalidCommandException, NotFoundException } from '@tadil-common';
import { SectionsRepository } from './sections.repository';

export class DeleteSectionUseCase {
  private _sectionsRepository: SectionsRepository;

  constructor(sectionsRepository: SectionsRepository) {
    this._sectionsRepository = sectionsRepository;
  }
  async execute(deleteSectionCommand: DeleteSectionCommand): Promise<void> {
    if (!deleteSectionCommand.sectionId) {
      throw new InvalidCommandException('Section ID is required');
    }

    const section = await this._sectionsRepository.getSectionById(
      deleteSectionCommand.sectionId
    );
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    await this._sectionsRepository.deleteSection(
      deleteSectionCommand.sectionId
    );
  }
}

export class DeleteSectionCommand {
  readonly sectionId: string;
  constructor(sectionId: string) {
    this.sectionId = sectionId;
  }
}
