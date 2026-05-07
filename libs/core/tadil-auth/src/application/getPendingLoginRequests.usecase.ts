import { UsersRepository, User, LOGIN_REQUEST_STATUS } from '@tadil-users';

export class GetPendingLoginRequestsUseCase {
  constructor(private readonly _usersRepository: UsersRepository) {}

  async execute(): Promise<User[]> {
    return this._usersRepository.getUsersByLoginRequestStatus(
      LOGIN_REQUEST_STATUS.PENDING
    );
  }
}
