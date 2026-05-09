import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
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

      if (command.city) {
        const currentAddresses = await this._usersRepository.getAddressesByUserId(user.id);
        if (currentAddresses.length === 0) {
          await this._usersRepository.addAddress({
            id: uuid(),
            userId: user.id,
            city: command.city
          });
        } else {
          await this._usersRepository.updateAddress({
            ...currentAddresses[0],
            city: command.city
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

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
    email?: string,
    commissionRate?: number,
    city?: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;
    this.commissionRate = commissionRate;
    this.city = city;
  }
}
