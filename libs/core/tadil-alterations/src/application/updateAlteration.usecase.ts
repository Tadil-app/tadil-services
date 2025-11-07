import { AlterationsRepository } from './alterations.repository';
import {
  InfrastructureException,
  InvalidCommandException,
  NotFoundException,
} from '@tadil-common';

export class UpdateAlterationUseCase {
  private _alterationsRepository: AlterationsRepository;

  constructor(alterationsRepository: AlterationsRepository) {
    this._alterationsRepository = alterationsRepository;
  }

  async execute(
    updateAlterationCommand: UpdateAlterationCommand
  ): Promise<void> {
    if (!updateAlterationCommand.id) {
      throw new InvalidCommandException('Alteration Id is required');
    }
    if (!updateAlterationCommand.englishName) {
      throw new InvalidCommandException('Alteration English Name is required');
    }
    if (!updateAlterationCommand.arabicName) {
      throw new InvalidCommandException('Alteration Arabic Name is required');
    }
    if (!updateAlterationCommand.hindiName) {
      throw new InvalidCommandException('Alteration Hindi Name is required');
    }
    if (!updateAlterationCommand.urduName) {
      throw new InvalidCommandException('Alteration Urdu Name is required');
    }
    if (!updateAlterationCommand.bengaliName) {
      throw new InvalidCommandException('Alteration Bengali Name is required');
    }

    const alteration = await this._alterationsRepository.getAlterationById(
      updateAlterationCommand.id
    );
    if (!alteration) {
      throw new NotFoundException('Alteration not found');
    }

    try {
      await this._alterationsRepository.updateAlteration({
        id: updateAlterationCommand.id,
        englishName: updateAlterationCommand.englishName,
        arabicName: updateAlterationCommand.arabicName,
        hindiName: updateAlterationCommand.hindiName,
        urduName: updateAlterationCommand.urduName,
        bengaliName: updateAlterationCommand.bengaliName,
        value: updateAlterationCommand.value,
        unit: updateAlterationCommand.unit,
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}

export class UpdateAlterationCommand {
  readonly id: string;
  readonly englishName: string;
  readonly arabicName: string;
  readonly hindiName: string;
  readonly urduName: string;
  readonly bengaliName: string;
  readonly value?: string;
  readonly unit?: string;
  constructor(
    id: string,
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string,
    value?: string,
    unit?: string
  ) {
    this.id = id;
    this.englishName = englishName;
    this.arabicName = arabicName;
    this.hindiName = hindiName;
    this.urduName = urduName;
    this.bengaliName = bengaliName;
    this.value = value;
    this.unit = unit;
  }
}
