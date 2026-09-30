import { InvalidCommandException } from '@tadil-common';
import { isDeletedAccountPhone } from './user.model';
import { UsersRepository } from './users.repository';

export class DeleteMyAccountUseCase {
  constructor(private readonly _usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<void> {
    if (!userId) {
      throw new InvalidCommandException('User id is required');
    }

    const user = await this._usersRepository.getUserById(userId);
    if (!user) {
      throw new InvalidCommandException('User not found');
    }
    if (isDeletedAccountPhone(user.phone)) {
      throw new InvalidCommandException('Account already deleted');
    }

    await this._usersRepository.anonymizeAccount(userId);
  }
}
