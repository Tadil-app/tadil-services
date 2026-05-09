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
    city: string;
    street?: string;
    district?: string;
  }): Promise<void> {
    const user = await this._usersRepository.getUserById(command.userId);
    if (!user) {
      throw new InvalidCommandException('User not found');
    }

    if (!command.city) {
      throw new InvalidCommandException('City is required');
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
        city: command.city,
        street: command.street,
        district: command.district,
      };
      await this._usersRepository.addAddress(address);
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
