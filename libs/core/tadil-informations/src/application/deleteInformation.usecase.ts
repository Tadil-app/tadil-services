import { InvalidCommandException, NotFoundException } from '@tadil-common';
import { InformationsRepository } from './information.repository';

export class DeleteInformationUseCase {
  private _informationsRepository: InformationsRepository;

  constructor(_informationsRepository: InformationsRepository) {
    this._informationsRepository = _informationsRepository;
  }
  async execute(
    deleteInformationCommand: DeleteInformationCommand
  ): Promise<void> {
    if (!deleteInformationCommand.informationId) {
      throw new InvalidCommandException('Information ID is required');
    }

    const information = await this._informationsRepository.getInformationById(
      deleteInformationCommand.informationId
    );
    if (!information) {
      throw new NotFoundException('Information not found');
    }

    await this._informationsRepository.deleteInformation(
      deleteInformationCommand.informationId
    );
  }
}

export class DeleteInformationCommand {
  readonly informationId: string;
  constructor(informationId: string) {
    this.informationId = informationId;
  }
}
