import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { ExtrasRepository } from './extras.repository';
import { v4 as uuidv4 } from 'uuid';

export class CreateExtraUseCase {
  private _extrasRepository: ExtrasRepository;
  constructor(_extrasRepository: ExtrasRepository) {
    this._extrasRepository = _extrasRepository;
  }

  async execute(
    createExtraCommand: CreateExtraCommand
  ): Promise<void> {
    if (!createExtraCommand.englishName) {
      throw new InvalidCommandException('English name is required');
    }
    if (!createExtraCommand.arabicName) {
      throw new InvalidCommandException('Arabic name is required');
    }
    if (!createExtraCommand.hindiName) {
      throw new InvalidCommandException('Hindi name is required');
    }
    if (!createExtraCommand.urduName) {
      throw new InvalidCommandException('Urdu name is required');
    }
    if (!createExtraCommand.bengaliName) {
      throw new InvalidCommandException('Bengali name is required');
    }
    if (!createExtraCommand.price) {
      throw new InvalidCommandException('Extra price is required');
    }

    try {
      const newSectionId = uuidv4();
      await this._extrasRepository.createExtra({
        id: newSectionId,
        ...createExtraCommand,
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}

export class CreateExtraCommand {
  readonly englishName: string;
  readonly arabicName: string;
  readonly hindiName: string;
  readonly urduName: string;
  readonly bengaliName: string;
  readonly price: number;

  constructor(
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string,
    price: number,
  ) {
    this.englishName = englishName;
    this.arabicName = arabicName;
    this.hindiName = hindiName;
    this.urduName = urduName;
    this.bengaliName = bengaliName;
    this.price = price;
  }
}
