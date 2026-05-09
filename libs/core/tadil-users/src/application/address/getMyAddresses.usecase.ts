import { Address } from '../user.model';
import { UsersRepository } from '../users.repository';

export class GetMyAddressesUseCase {
  constructor(private readonly _usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<Address[]> {
    return this._usersRepository.getAddressesByUserId(userId);
  }
}
