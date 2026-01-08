import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { AlterationsRepository } from './alterations.repository';
import { v4 as uuidv4 } from 'uuid';

export class CreateAlterationUseCase {
  private _alterationsRepository: AlterationsRepository;
  constructor(_alterationsRepository: AlterationsRepository) {
    this._alterationsRepository = _alterationsRepository;
  }

  async execute(
    createAlterationCommand: CreateAlterationCommand
  ): Promise<void> {
    if (!createAlterationCommand.englishName) {
      throw new InvalidCommandException('English name is required');
    }
    if (!createAlterationCommand.arabicName) {
      throw new InvalidCommandException('Arabic name is required');
    }
    if (!createAlterationCommand.hindiName) {
      throw new InvalidCommandException('Hindi name is required');
    }
    if (!createAlterationCommand.urduName) {
      throw new InvalidCommandException('Urdu name is required');
    }
    if (!createAlterationCommand.bengaliName) {
      throw new InvalidCommandException('Bengali name is required');
    }
    if (!createAlterationCommand.price) {
      throw new InvalidCommandException('Alteration price is required');
    }

    try {
      const newSectionId = uuidv4();
      await this._alterationsRepository.createAlteration({
        id: newSectionId,
        ...createAlterationCommand,
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}

export class CreateAlterationCommand {
  readonly englishName: string;
  readonly arabicName: string;
  readonly hindiName: string;
  readonly urduName: string;
  readonly bengaliName: string;
  readonly price: number;
  readonly sections: string[];
  readonly informations: string[]

  constructor(
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string,
    price: number,
    sections: string[],
    informations: string[]
  ) {
    this.englishName = englishName;
    this.arabicName = arabicName;
    this.hindiName = hindiName;
    this.urduName = urduName;
    this.bengaliName = bengaliName;
    this.price = price;
    this.sections = sections;
    this.informations = informations;
  }
}
