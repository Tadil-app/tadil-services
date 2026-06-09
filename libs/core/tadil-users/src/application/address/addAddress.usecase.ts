import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { Address, ROLE } from '../user.model';
import { UsersRepository } from '../users.repository';
import { v4 as uuid } from 'uuid';

export class AddAddressUseCase {
  constructor(private readonly _usersRepository: UsersRepository) {}

  async execute(command: {
    userId: string;
    cityId?: number;
    cityNameAr: string;
    cityNameEn: string;
    districtId?: string;
    districtNameAr?: string;
    districtNameEn?: string;
    street?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<void> {
    const user = await this._usersRepository.getUserById(command.userId);
    if (!user) {
      throw new InvalidCommandException('User not found');
    }

    if (!command.cityNameAr || !command.cityNameEn) {
      throw new InvalidCommandException('City is required');
    }

    if (command.latitude == null || command.longitude == null) {
      throw new InvalidCommandException('Location is required');
    }

    const currentAddresses = await this._usersRepository.getAddressesByUserId(command.userId);

    // Enforce single address for tailors and couriers
    if ((user.role === ROLE.TAILOR || user.role === ROLE.COURIER) && currentAddresses.length > 0) {
      throw new InvalidCommandException('Tailors and Couriers can only have one address');
    }

    try {
      const address: Address = {
        id: uuid(),
        userId: command.userId,
        cityId: command.cityId,
        cityNameAr: command.cityNameAr,
        cityNameEn: command.cityNameEn,
        districtId: command.districtId,
        districtNameAr: command.districtNameAr,
        districtNameEn: command.districtNameEn,
        street: command.street,
        latitude: command.latitude,
        longitude: command.longitude,
      };
      await this._usersRepository.addAddress(address);
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
