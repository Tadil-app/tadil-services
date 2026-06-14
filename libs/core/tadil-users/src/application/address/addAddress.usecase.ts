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
    cityNameBn: string;
    cityNameHi: string;
    cityNameUr: string;
    districtId?: string;
    districtNameAr?: string;
    districtNameEn?: string;
    districtNameBn?: string;
    districtNameHi?: string;
    districtNameUr?: string;
    street?: string;
    streetAr?: string;
    streetEn?: string;
    streetBn?: string;
    streetHi?: string;
    streetUr?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<void> {
    const user = await this._usersRepository.getUserById(command.userId);
    if (!user) {
      throw new InvalidCommandException('User not found');
    }

    // Only customers may add addresses from the app; couriers/tailors are
    // view-only and get their single address provisioned by an admin.
    if (user.role !== ROLE.CUSTOMER) {
      throw new InvalidCommandException('Only customers can add addresses');
    }

    if (!command.cityNameAr || !command.cityNameEn) {
      throw new InvalidCommandException('City is required');
    }

    if (command.latitude == null || command.longitude == null) {
      throw new InvalidCommandException('Location is required');
    }

    try {
      const address: Address = {
        id: uuid(),
        userId: command.userId,
        cityId: command.cityId,
        cityNameAr: command.cityNameAr,
        cityNameEn: command.cityNameEn,
        cityNameBn: command.cityNameBn,
        cityNameHi: command.cityNameHi,
        cityNameUr: command.cityNameUr,
        districtId: command.districtId,
        districtNameAr: command.districtNameAr,
        districtNameEn: command.districtNameEn,
        districtNameBn: command.districtNameBn,
        districtNameHi: command.districtNameHi,
        districtNameUr: command.districtNameUr,
        street: command.street,
        streetAr: command.streetAr,
        streetEn: command.streetEn,
        streetBn: command.streetBn,
        streetHi: command.streetHi,
        streetUr: command.streetUr,
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
