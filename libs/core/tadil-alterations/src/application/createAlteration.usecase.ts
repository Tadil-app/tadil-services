import { AlterationsRepository } from './alterations.repository';
import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { v4 as uuidv4 } from 'uuid';

export class CreateAlterationUseCase {
  private _alterationsRepository: AlterationsRepository;

  constructor(alterationsRepository: AlterationsRepository) {
    this._alterationsRepository = alterationsRepository;
  }

  async execute(
    createAlterationCommand: CreateAlterationCommand
  ): Promise<void> {
    if (!createAlterationCommand.englishName) {
      throw new InvalidCommandException('Alteration English Name is required');
    }
    if (!createAlterationCommand.arabicName) {
      throw new InvalidCommandException('Alteration Arabic Name is required');
    }
    if (!createAlterationCommand.hindiName) {
      throw new InvalidCommandException('Alteration Hindi Name is required');
    }
    if (!createAlterationCommand.urduName) {
      throw new InvalidCommandException('Alteration Urdu Name is required');
    }
    if (!createAlterationCommand.bengaliName) {
      throw new InvalidCommandException('Alteration Bengali Name is required');
    }

    try {
      const newAlterationId = uuidv4();
      await this._alterationsRepository.createAlteration({
        id: newAlterationId,
        englishName: createAlterationCommand.englishName,
        arabicName: createAlterationCommand.arabicName,
        hindiName: createAlterationCommand.hindiName,
        urduName: createAlterationCommand.urduName,
        bengaliName: createAlterationCommand.bengaliName,
        value: createAlterationCommand.value,
        unit: createAlterationCommand.unit,
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
  readonly value?: string;
  readonly unit?: string;
  constructor(
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string,
    value?: string,
    unit?: string
  ) {
    this.englishName = englishName;
    this.arabicName = arabicName;
    this.hindiName = hindiName;
    this.urduName = urduName;
    this.bengaliName = bengaliName;
    this.value = value;
    this.unit = unit;
  }
}
