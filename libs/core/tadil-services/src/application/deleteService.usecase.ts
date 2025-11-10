import { InvalidCommandException, NotFoundException } from '@tadil-common';
import { ServicesRepository } from './services.repository';

export class DeleteServiceUseCase {
  private _servicesRepository: ServicesRepository;

  constructor(_servicesRepository: ServicesRepository) {
    this._servicesRepository = _servicesRepository;
  }
  async execute(deleteServiceCommand: DeleteServiceCommand): Promise<void> {
    if (!deleteServiceCommand.serviceId) {
      throw new InvalidCommandException('Service ID is required');
    }

    const service = await this._servicesRepository.getServiceById(
      deleteServiceCommand.serviceId
    );
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this._servicesRepository.deleteService(deleteServiceCommand.serviceId);
  }
}

export class DeleteServiceCommand {
  readonly serviceId: string;
  constructor(serviceId: string) {
    this.serviceId = serviceId;
  }
}
