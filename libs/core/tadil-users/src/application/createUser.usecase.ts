import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { RoleType } from './user.model';
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
        await this._usersRepository.updateUser({
          ...userByPhone,
          firstName: command.firstName,
          lastName: command.lastName,
          role: command.role,
          email: command.email ?? userByPhone.email,
        });
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
      });
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

  constructor(
    firstName: string,
    lastName: string,
    phone: string,
    role: RoleType,
    email?: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.role = role;
    this.email = email;
  }
}
