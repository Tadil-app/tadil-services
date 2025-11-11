import { InvalidCommandException, NotFoundException } from '@tadil-common';
import { AlterationsRepository } from './alterations.repository';

export class DeleteAlterationUseCase {
  private _alterationsRepository: AlterationsRepository;

  constructor(_alterationsRepository: AlterationsRepository) {
    this._alterationsRepository = _alterationsRepository;
  }
  async execute(deleteAlterationCommand: DeleteAlterationCommand): Promise<void> {
    if (!deleteAlterationCommand.alterationId) {
      throw new InvalidCommandException('Alteration ID is required');
    }

    const alteration = await this._alterationsRepository.getAlterationById(
      deleteAlterationCommand.alterationId
    );
    if (!alteration) {
      throw new NotFoundException('Alteration not found');
    }

    await this._alterationsRepository.deleteAlteration(
      deleteAlterationCommand.alterationId
    );
  }
}

export class DeleteAlterationCommand {
  readonly alterationId: string;
  constructor(alterationId: string) {
    this.alterationId = alterationId;
  }
}
