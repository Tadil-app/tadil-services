import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { ROLE } from './user.model';
import { UsersRepository } from './users.repository';
import { v4 as uuid } from 'uuid';

export class UpdateUserUseCase {
  private readonly _usersRepository: UsersRepository;
  constructor(usersRepository: UsersRepository) {
    this._usersRepository = usersRepository;
  }

  async execute(command: UpdateUserCommand): Promise<void> {
    if (!command.id) {
      throw new InvalidCommandException('User id is required');
    }
    if (!command.firstName) {
      throw new InvalidCommandException('First name is required');
    }
    if (!command.lastName) {
      throw new InvalidCommandException('Last name is required');
    }
    if (!command.phone) {
      throw new InvalidCommandException('Phone is required');
    }

    const user = await this._usersRepository.getUserById(command.id);
    if (!user) {
      throw new InvalidCommandException('User not found');
    }

    const userByPhone = await this._usersRepository.getUserByPhone(
      command.phone
    );
    if (userByPhone && userByPhone.id !== user.id) {
      throw new InvalidCommandException(
        'User Phone number already exists for another user'
      );
    }

    // Tailors and couriers must keep a full address (same flow as the customer
    // app): a city and a pinned location are required, district optional.
    const requiresAddress =
      user.role === ROLE.TAILOR || user.role === ROLE.COURIER;
    const cityNameAr = command.cityNameAr ?? command.city;
    const cityNameEn = command.cityNameEn ?? command.city;

    if (requiresAddress) {
      if (!cityNameAr || !cityNameEn) {
        throw new InvalidCommandException('City is required');
      }
      if (command.latitude == null || command.longitude == null) {
        throw new InvalidCommandException('Location is required');
      }
    }

    const addressData = {
      cityId: command.cityId,
      cityNameAr: cityNameAr ?? '',
      cityNameEn: cityNameEn ?? '',
      districtId: command.districtId,
      districtNameAr: command.districtNameAr,
      districtNameEn: command.districtNameEn,
      street: command.street,
      latitude: command.latitude,
      longitude: command.longitude,
    };

    try {
      await this._usersRepository.updateUser({
        id: user.id,
        firstName: command.firstName,
        lastName: command.lastName,
        phone: command.phone,
        role: user.role,
        email: command.email,
        commissionRate: command.commissionRate ?? user.commissionRate,
      });

      if (cityNameAr) {
        const currentAddresses = await this._usersRepository.getAddressesByUserId(user.id);
        if (currentAddresses.length === 0) {
          await this._usersRepository.addAddress({
            id: uuid(),
            userId: user.id,
            ...addressData,
          });
        } else {
          await this._usersRepository.updateAddress({
            ...currentAddresses[0],
            ...addressData,
          });
        }
      }
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}

export class UpdateUserCommand {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly email?: string;
  readonly commissionRate?: number;
  readonly city?: string;
  readonly cityId?: number;
  readonly cityNameAr?: string;
  readonly cityNameEn?: string;
  readonly districtId?: string;
  readonly districtNameAr?: string;
  readonly districtNameEn?: string;
  readonly street?: string;
  readonly latitude?: number;
  readonly longitude?: number;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
    email?: string,
    commissionRate?: number,
    city?: string,
    address?: {
      cityId?: number;
      cityNameAr?: string;
      cityNameEn?: string;
      districtId?: string;
      districtNameAr?: string;
      districtNameEn?: string;
      street?: string;
      latitude?: number;
      longitude?: number;
    }
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;
    this.commissionRate = commissionRate;
    this.city = city;
    this.cityId = address?.cityId;
    this.cityNameAr = address?.cityNameAr;
    this.cityNameEn = address?.cityNameEn;
    this.districtId = address?.districtId;
    this.districtNameAr = address?.districtNameAr;
    this.districtNameEn = address?.districtNameEn;
    this.street = address?.street;
    this.latitude = address?.latitude;
    this.longitude = address?.longitude;
  }
}
