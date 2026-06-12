import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { ROLE, RoleType } from '../user.model';
import { UsersRepository } from '../users.repository';

export class UpdateAddressUseCase {
  constructor(private readonly _usersRepository: UsersRepository) {}

  async execute(command: {
    id: string;
    role: RoleType;
    cityId?: number;
    cityNameAr?: string;
    cityNameEn?: string;
    cityNameBn?: string;
    cityNameHi?: string;
    cityNameUr?: string;
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
    // Only customers may modify addresses; couriers/tailors are view-only.
    if (command.role !== ROLE.CUSTOMER) {
      throw new InvalidCommandException('Only customers can modify addresses');
    }

    const existingAddress = await this._usersRepository.getAddressById(command.id);
    if (!existingAddress) {
      throw new InvalidCommandException('Address not found');
    }

    // The merged address must still keep a city and a location; district is optional.
    const merged = {
      ...existingAddress,
      cityId: command.cityId ?? existingAddress.cityId,
      cityNameAr: command.cityNameAr ?? existingAddress.cityNameAr,
      cityNameEn: command.cityNameEn ?? existingAddress.cityNameEn,
      cityNameBn: command.cityNameBn ?? existingAddress.cityNameBn,
      cityNameHi: command.cityNameHi ?? existingAddress.cityNameHi,
      cityNameUr: command.cityNameUr ?? existingAddress.cityNameUr,
      districtId: command.districtId ?? existingAddress.districtId,
      districtNameAr: command.districtNameAr ?? existingAddress.districtNameAr,
      districtNameEn: command.districtNameEn ?? existingAddress.districtNameEn,
      districtNameBn: command.districtNameBn ?? existingAddress.districtNameBn,
      districtNameHi: command.districtNameHi ?? existingAddress.districtNameHi,
      districtNameUr: command.districtNameUr ?? existingAddress.districtNameUr,
      street: command.street ?? existingAddress.street,
      streetAr: command.streetAr ?? existingAddress.streetAr,
      streetEn: command.streetEn ?? existingAddress.streetEn,
      streetBn: command.streetBn ?? existingAddress.streetBn,
      streetHi: command.streetHi ?? existingAddress.streetHi,
      streetUr: command.streetUr ?? existingAddress.streetUr,
      latitude: command.latitude ?? existingAddress.latitude,
      longitude: command.longitude ?? existingAddress.longitude,
    };

    if (!merged.cityNameAr || !merged.cityNameEn) {
      throw new InvalidCommandException('City is required');
    }

    if (merged.latitude == null || merged.longitude == null) {
      throw new InvalidCommandException('Location is required');
    }

    try {
      await this._usersRepository.updateAddress(merged);
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
