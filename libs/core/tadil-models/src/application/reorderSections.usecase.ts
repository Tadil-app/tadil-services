import {
  InfrastructureException,
  InvalidCommandException,
  NotFoundException,
} from '@tadil-common';
import { ModelsRepository } from './models.repository';

export class ReorderSectionsUseCase {
  constructor(private readonly _modelsRepository: ModelsRepository) {}

  async execute(command: ReorderSectionsCommand): Promise<void> {
    if (!command.modelImageId) {
      throw new InvalidCommandException('Model Image ID is required');
    }
    if (!command.sectionIds || command.sectionIds.length === 0) {
      throw new InvalidCommandException('Section IDs are required');
    }

    const modelImage = await this._modelsRepository.getModelImageById(
      command.modelImageId
    );
    if (!modelImage) {
      throw new NotFoundException('Model Image not found');
    }

    try {
      await this._modelsRepository.reorderSections(
        command.modelImageId,
        command.sectionIds
      );
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}

export class ReorderSectionsCommand {
  readonly modelImageId: string;
  readonly sectionIds: string[];

  constructor(modelImageId: string, sectionIds: string[]) {
    this.modelImageId = modelImageId;
    this.sectionIds = sectionIds;
  }
}
