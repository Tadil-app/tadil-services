import {
  InfrastructureException,
  InvalidCommandException,
} from '@tadil-common';
import { UsersRepository } from '../users.repository';

export class UpdateAddressUseCase {
  constructor(private readonly _usersRepository: UsersRepository) {}

  async execute(command: {
    id: string;
    city?: string;
    street?: string;
    district?: string;
  }): Promise<void> {
    const existingAddress = await this._usersRepository.getAddressById(command.id);
    if (!existingAddress) {
      throw new InvalidCommandException('Address not found');
    }

    try {
      await this._usersRepository.updateAddress({
        ...existingAddress,
        city: command.city ?? existingAddress.city,
        street: command.street ?? existingAddress.street,
        district: command.district ?? existingAddress.district,
      });
    } catch (error) {
      if (error instanceof Error)
        throw new InfrastructureException(error.message);
      else throw error;
    }
  }
}
