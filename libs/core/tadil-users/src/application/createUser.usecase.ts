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

        if (command.city) {
          const currentAddresses = await this._usersRepository.getAddressesByUserId(userByPhone.id);
          if (currentAddresses.length === 0) {
             await this._usersRepository.addAddress({
                id: uuid(),
                userId: userByPhone.id,
                city: command.city
             });
          } else {
             await this._usersRepository.updateAddress({
                ...currentAddresses[0],
                city: command.city
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

      if (command.city) {
        await this._usersRepository.addAddress({
          id: uuid(),
          userId: newUserId,
          city: command.city,
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

  constructor(
    firstName: string,
    lastName: string,
    phone: string,
    role: RoleType,
    email?: string,
    commissionRate?: number,
    city?: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.role = role;
    this.email = email;
    this.commissionRate = commissionRate;
    this.city = city;
  }
}
