import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { ROLE, RoleType } from '../user.model';
import { UsersRepository } from '../users.repository';

export class DeleteAddressUseCase {
  constructor(private readonly _usersRepository: UsersRepository) {}

  async execute(command: {
    id: string;
    userId: string;
    role: RoleType;
  }): Promise<void> {
    // Only customers may delete addresses; couriers/tailors keep their single address.
    if (command.role !== ROLE.CUSTOMER) {
      throw new InvalidCommandException('Only customers can delete addresses');
    }

    const existingAddress = await this._usersRepository.getAddressById(command.id);
    if (!existingAddress) {
      throw new InvalidCommandException('Address not found');
    }

    // Guard against deleting another user's address.
    if (existingAddress.userId !== command.userId) {
      throw new InvalidCommandException('Address does not belong to the user');
    }

    try {
      await this._usersRepository.deleteAddress(command.id);
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
