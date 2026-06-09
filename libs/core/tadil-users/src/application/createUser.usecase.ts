import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { RoleType, ROLE } from './user.model';
import { UsersRepository } from './users.repository';
import { v4 as uuid } from 'uuid';

export class CreateUserUseCase {
  private readonly _usersRepository: UsersRepository;
  constructor(usersRepository: UsersRepository) {
    this._usersRepository = usersRepository;
  }

  async execute(command: CreateUserCommand): Promise<void> {
    if (!command.firstName) {
      throw new InvalidCommandException('First name is required');
    }
    if (!command.lastName) {
      throw new InvalidCommandException('Last name is required');
    }
    if (!command.phone) {
      throw new InvalidCommandException('Phone is required');
    }
    if (!command.role) {
      throw new InvalidCommandException('Role is required');
    }

    // Tailors and couriers are created with a full address (same flow as the
    // customer app): a city and a pinned location are required, district is
    // optional. Other roles (e.g. customers) keep the address optional.
    const requiresAddress =
      command.role === ROLE.TAILOR || command.role === ROLE.COURIER;
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

    // The address payload shared by the create and update branches below.
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

    const userByPhone = await this._usersRepository.getUserByPhone(
      command.phone
    );

    try {
      if (userByPhone) {
        // If user exists, update their profile and role
        const updatedUser = {
          ...userByPhone,
          firstName: command.firstName,
          lastName: command.lastName,
          role: command.role,
          email: command.email ?? userByPhone.email,
          commissionRate: command.commissionRate ?? userByPhone.commissionRate,
        };
        await this._usersRepository.updateUser(updatedUser);

        if (cityNameAr) {
          const currentAddresses = await this._usersRepository.getAddressesByUserId(userByPhone.id);
          if (currentAddresses.length === 0) {
             await this._usersRepository.addAddress({
                id: uuid(),
                userId: userByPhone.id,
                ...addressData,
             });
          } else {
             await this._usersRepository.updateAddress({
                ...currentAddresses[0],
                ...addressData,
             });
          }
        }
        return;
      }

      const newUserId = uuid();
      await this._usersRepository.createUser({
        id: newUserId,
        firstName: command.firstName,
        lastName: command.lastName,
        phone: command.phone,
        role: command.role,
        email: command.email,
        commissionRate: command.commissionRate ?? 10,
      });

      if (cityNameAr) {
        await this._usersRepository.addAddress({
          id: uuid(),
          userId: newUserId,
          ...addressData,
        });
      }
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}

export class CreateUserCommand {
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly role: RoleType;
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
    firstName: string,
    lastName: string,
    phone: string,
    role: RoleType,
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
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.role = role;
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
