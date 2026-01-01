import { ExtrasRepository } from './extras.repository';
import {
  InfrastructureException,
  InvalidCommandException,
  NotFoundException,
} from '@tadil-common';

export class UpdateExtraUseCase {
  private _extrasRepository: ExtrasRepository;

  constructor(extrasRepository: ExtrasRepository) {
    this._extrasRepository = extrasRepository;
  }

  async execute(updateExtraCommand: UpdateExtraCommand): Promise<void> {
    if (!updateExtraCommand.id) {
      throw new InvalidCommandException('Extra ID is required');
    }
    if (!updateExtraCommand.englishName) {
      throw new InvalidCommandException('Extra English Name is required');
    }
    if (!updateExtraCommand.arabicName) {
      throw new InvalidCommandException('Extra Arabic Name is required');
    }
    if (!updateExtraCommand.hindiName) {
      throw new InvalidCommandException('Extra Hindi Name is required');
    }
    if (!updateExtraCommand.urduName) {
      throw new InvalidCommandException('Extra Urdu Name is required');
    }
    if (!updateExtraCommand.bengaliName) {
      throw new InvalidCommandException('Extra Bengali Name is required');
    }
    if (!updateExtraCommand.price) {
      throw new InvalidCommandException('Extra Price is required');
    }

    const extra = await this._extrasRepository.getExtraById(
      updateExtraCommand.id
    );
    if (!extra) {
      throw new NotFoundException('Extra not found');
    }

    try {
      await this._extrasRepository.updateExtra(updateExtraCommand);
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}

export class UpdateExtraCommand {
  readonly id: string;
  readonly englishName: string;
  readonly arabicName: string;
  readonly hindiName: string;
  readonly urduName: string;
  readonly bengaliName: string;
  readonly price: number;
  constructor(
    id: string,
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string,
    price: number
  ) {
    this.id = id;
    this.englishName = englishName;
    this.arabicName = arabicName;
    this.hindiName = hindiName;
    this.urduName = urduName;
    this.bengaliName = bengaliName;
    this.price = price;
  }
}
