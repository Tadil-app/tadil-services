import { InvalidCommandException } from '@tadil-common';
import { UsersRepository, LOGIN_REQUEST_STATUS } from '@tadil-users';

export class RejectLoginRequestUseCase {
  constructor(private readonly _usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this._usersRepository.getUserById(userId);

    if (!user) {
      throw new InvalidCommandException('User not found');
    }

    await this._usersRepository.updateUser({
      ...user,
      loginRequestStatus: LOGIN_REQUEST_STATUS.REJECTED,
      loginToken: undefined,
    });
  }
}
