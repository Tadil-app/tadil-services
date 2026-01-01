import { InvalidCommandException, NotFoundException } from '@tadil-common';
import { ExtrasRepository } from './extras.repository';

export class DeleteExtraUseCase {
  private _extrasRepository: ExtrasRepository;

  constructor(_extrasRepository: ExtrasRepository) {
    this._extrasRepository = _extrasRepository;
  }
  async execute(deleteExtraCommand: DeleteExtraCommand): Promise<void> {
    if (!deleteExtraCommand.extraId) {
      throw new InvalidCommandException('Extra ID is required');
    }

    const extra = await this._extrasRepository.getExtraById(
      deleteExtraCommand.extraId
    );
    if (!extra) {
      throw new NotFoundException('Extra not found');
    }

    await this._extrasRepository.deleteExtra(
      deleteExtraCommand.extraId
    );
  }
}

export class DeleteExtraCommand {
  readonly extraId: string;
  constructor(extraId: string) {
    this.extraId = extraId;
  }
}
