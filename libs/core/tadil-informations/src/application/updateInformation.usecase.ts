import { InformationsRepository } from './information.repository';
import {
  InfrastructureException,
  InvalidCommandException,
  NotFoundException,
} from '@tadil-common';

export class UpdateInformationUseCase {
  private _informationsRepository: InformationsRepository;

  constructor(informationsRepository: InformationsRepository) {
    this._informationsRepository = informationsRepository;
  }

  async execute(
    updateInformationCommand: UpdateInformationCommand
  ): Promise<void> {
    if (!updateInformationCommand.id) {
      throw new InvalidCommandException('Information Id is required');
    }
    if (!updateInformationCommand.englishName) {
      throw new InvalidCommandException('Information English Name is required');
    }
    if (!updateInformationCommand.arabicName) {
      throw new InvalidCommandException('Information Arabic Name is required');
    }
    if (!updateInformationCommand.hindiName) {
      throw new InvalidCommandException('Information Hindi Name is required');
    }
    if (!updateInformationCommand.urduName) {
      throw new InvalidCommandException('Information Urdu Name is required');
    }
    if (!updateInformationCommand.bengaliName) {
      throw new InvalidCommandException('Information Bengali Name is required');
    }

    const information = await this._informationsRepository.getInformationById(
      updateInformationCommand.id
    );
    if (!information) {
      throw new NotFoundException('Information not found');
    }

    try {
      await this._informationsRepository.updateInformation(
        updateInformationCommand
      );
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}

export class UpdateInformationCommand {
  readonly id: string;
  readonly englishName: string;
  readonly arabicName: string;
  readonly hindiName: string;
  readonly urduName: string;
  readonly bengaliName: string;
  readonly extras: string[];
  readonly unit?: string;
  constructor(
    id: string,
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string,
    extras: string[],
    unit?: string
  ) {
    this.id = id;
    this.englishName = englishName;
    this.arabicName = arabicName;
    this.hindiName = hindiName;
    this.urduName = urduName;
    this.bengaliName = bengaliName;
    this.extras = extras;
    this.unit = unit;
  }
}
