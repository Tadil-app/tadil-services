import { InvalidCommandException, NotFoundException } from '@tadil-common';
import { ModelsRepository } from './models.repository';

export class DeleteSectionUseCase {
  private _modelsRepository: ModelsRepository;

  constructor(_modelsRepository: ModelsRepository) {
    this._modelsRepository = _modelsRepository;
  }
  async execute(deleteSectionCommand: DeleteSectionCommand): Promise<void> {
    if (!deleteSectionCommand.sectionId) {
      throw new InvalidCommandException('Section ID is required');
    }

    const section = await this._modelsRepository.getSectionById(
      deleteSectionCommand.sectionId
    );
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    await this._modelsRepository.deleteSection(deleteSectionCommand.sectionId);
  }
}

export class DeleteSectionCommand {
  readonly sectionId: string;
  constructor(sectionId: string) {
    this.sectionId = sectionId;
  }
}
