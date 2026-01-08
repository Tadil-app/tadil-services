import { InformationsRepository } from './information.repository';
import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { v4 as uuidv4 } from 'uuid';

export class CreateInformationUseCase {
  private _informationsRepository: InformationsRepository;

  constructor(informationsRepository: InformationsRepository) {
    this._informationsRepository = informationsRepository;
  }

  async execute(
    createInformationCommand: CreateInformationCommand
  ): Promise<void> {
    if (!createInformationCommand.englishName) {
      throw new InvalidCommandException('Information English Name is required');
    }
    if (!createInformationCommand.arabicName) {
      throw new InvalidCommandException('Information Arabic Name is required');
    }
    if (!createInformationCommand.hindiName) {
      throw new InvalidCommandException('Information Hindi Name is required');
    }
    if (!createInformationCommand.urduName) {
      throw new InvalidCommandException('Information Urdu Name is required');
    }
    if (!createInformationCommand.bengaliName) {
      throw new InvalidCommandException('Information Bengali Name is required');
    }

    try {
      const newInformationId = uuidv4();
      await this._informationsRepository.createInformation({
        ...createInformationCommand,
        id: newInformationId,
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}

export class CreateInformationCommand {
  readonly englishName: string;
  readonly arabicName: string;
  readonly hindiName: string;
  readonly urduName: string;
  readonly bengaliName: string;
  readonly extras: string[];
  readonly unit?: string;
  constructor(
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string,
    extras: string[],
    unit?: string
  ) {
    this.englishName = englishName;
    this.arabicName = arabicName;
    this.hindiName = hindiName;
    this.urduName = urduName;
    this.bengaliName = bengaliName;
    this.extras = extras;
    this.unit = unit;
  }
}
