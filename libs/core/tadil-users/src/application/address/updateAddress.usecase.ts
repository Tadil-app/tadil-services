import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { UsersRepository } from '../users.repository';

export class UpdateAddressUseCase {
  constructor(private readonly _usersRepository: UsersRepository) {}

  async execute(command: {
    id: string;
    cityId?: number;
    cityNameAr?: string;
    cityNameEn?: string;
    districtId?: string;
    districtNameAr?: string;
    districtNameEn?: string;
    street?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<void> {
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
      districtId: command.districtId ?? existingAddress.districtId,
      districtNameAr: command.districtNameAr ?? existingAddress.districtNameAr,
      districtNameEn: command.districtNameEn ?? existingAddress.districtNameEn,
      street: command.street ?? existingAddress.street,
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
