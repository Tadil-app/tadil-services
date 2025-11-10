import { ServicesRepository } from './services.repository';
import {
  InfrastructureException,
  InvalidCommandException,
  NotFoundException,
} from '@tadil-common';

export class UpdateServiceUseCase {
  private _servicesRepository: ServicesRepository;

  constructor(servicesRepository: ServicesRepository) {
    this._servicesRepository = servicesRepository;
  }

  async execute(updateServiceCommand: UpdateServiceCommand): Promise<void> {
    if (!updateServiceCommand.id) {
      throw new InvalidCommandException('Service ID is required');
    }
    if (!updateServiceCommand.englishName) {
      throw new InvalidCommandException('Service English Name is required');
    }
    if (!updateServiceCommand.arabicName) {
      throw new InvalidCommandException('Service Arabic Name is required');
    }
    if (!updateServiceCommand.hindiName) {
      throw new InvalidCommandException('Service Hindi Name is required');
    }
    if (!updateServiceCommand.urduName) {
      throw new InvalidCommandException('Service Urdu Name is required');
    }
    if (!updateServiceCommand.bengaliName) {
      throw new InvalidCommandException('Service Bengali Name is required');
    }
    if (!updateServiceCommand.price) {
      throw new InvalidCommandException('Service Price is required');
    }

    const service = await this._servicesRepository.getServiceById(
      updateServiceCommand.id
    );
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    try {
      await this._servicesRepository.updateService(updateServiceCommand);
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}

export class UpdateServiceCommand {
  readonly id: string;
  readonly englishName: string;
  readonly arabicName: string;
  readonly hindiName: string;
  readonly urduName: string;
  readonly bengaliName: string;
  readonly price: number;
  readonly sections: string[];
  readonly alterations: string[];
  constructor(
    id: string,
    englishName: string,
    arabicName: string,
    hindiName: string,
    urduName: string,
    bengaliName: string,
    price: number,
    sections: string[],
    alterations: string[]
  ) {
    this.id = id;
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
