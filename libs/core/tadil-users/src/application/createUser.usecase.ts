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
    // bn/hi/ur are NOT NULL on the address; fall back to en (then the legacy
    // free-text city) when the admin form didn't supply a translated name.
    const cityNameBn = command.cityNameBn ?? cityNameEn;
    const cityNameHi = command.cityNameHi ?? cityNameEn;
    const cityNameUr = command.cityNameUr ?? cityNameAr;

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
      cityNameBn: cityNameBn ?? '',
      cityNameHi: cityNameHi ?? '',
      cityNameUr: cityNameUr ?? '',
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
  readonly cityNameBn?: string;
  readonly cityNameHi?: string;
  readonly cityNameUr?: string;
  readonly districtId?: string;
  readonly districtNameAr?: string;
  readonly districtNameEn?: string;
  readonly districtNameBn?: string;
  readonly districtNameHi?: string;
  readonly districtNameUr?: string;
  readonly street?: string;
  readonly streetAr?: string;
  readonly streetEn?: string;
  readonly streetBn?: string;
  readonly streetHi?: string;
  readonly streetUr?: string;
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
    this.cityNameBn = address?.cityNameBn;
    this.cityNameHi = address?.cityNameHi;
    this.cityNameUr = address?.cityNameUr;
    this.districtId = address?.districtId;
    this.districtNameAr = address?.districtNameAr;
    this.districtNameEn = address?.districtNameEn;
    this.districtNameBn = address?.districtNameBn;
    this.districtNameHi = address?.districtNameHi;
    this.districtNameUr = address?.districtNameUr;
    this.street = address?.street;
    this.streetAr = address?.streetAr;
    this.streetEn = address?.streetEn;
    this.streetBn = address?.streetBn;
    this.streetHi = address?.streetHi;
    this.streetUr = address?.streetUr;
    this.latitude = address?.latitude;
    this.longitude = address?.longitude;
  }
}
