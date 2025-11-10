import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { ServicesRepository } from './services.repository';
import { v4 as uuidv4 } from 'uuid';

export class CreateServiceUseCase {
  private _servicesRepository: ServicesRepository;
  constructor(_servicesRepository: ServicesRepository) {
    this._servicesRepository = _servicesRepository;
  }

  async execute(createServiceCommand: CreateServiceCommand): Promise<void> {
    if (!createServiceCommand.englishName) {
      throw new InvalidCommandException('English name is required');
    }
    if (!createServiceCommand.arabicName) {
      throw new InvalidCommandException('Arabic name is required');
    }
    if (!createServiceCommand.hindiName) {
      throw new InvalidCommandException('Hindi name is required');
    }
    if (!createServiceCommand.urduName) {
      throw new InvalidCommandException('Urdu name is required');
    }
    if (!createServiceCommand.bengaliName) {
      throw new InvalidCommandException('Bengali name is required');
    }
    if (!createServiceCommand.price) {
      throw new InvalidCommandException('Service prioce is required');
    }

    try {
      const newSectionId = uuidv4();
      await this._servicesRepository.createService({
        id: newSectionId,
        ...createServiceCommand,
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}

export class CreateServiceCommand {
  readonly englishName: string;
  readonly arabicName: string;
  readonly hindiName: string;
  readonly urduName: string;
  readonly bengaliName: string;
  readonly price: number;
  readonly sections: string[];
  readonly alterations: string[];

  constructor(
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string,
    price: number,
    sections: string[],
    alterations: string[]
  ) {
    this.englishName = englishName;
    this.arabicName = arabicName;
    this.hindiName = hindiName;
    this.urduName = urduName;
    this.bengaliName = bengaliName;
    this.price = price;
    this.sections = sections;
    this.alterations = alterations;
  }
}
