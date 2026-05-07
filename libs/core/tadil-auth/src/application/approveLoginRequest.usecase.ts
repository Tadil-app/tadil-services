import { InvalidCommandException } from '@tadil-common';
import { UsersRepository, LOGIN_REQUEST_STATUS } from '@tadil-users';
import * as jwt from 'jsonwebtoken';

export class ApproveLoginRequestUseCase {
  constructor(
    private readonly _usersRepository: UsersRepository,
    private readonly _jwtSecret: string
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this._usersRepository.getUserById(userId);

    if (!user) {
      throw new InvalidCommandException('User not found');
    }

    const token = jwt.sign(
      { sub: user.id, phone: user.phone, role: user.role },
      this._jwtSecret,
      { expiresIn: '30d' }
    );

    await this._usersRepository.updateUser({
      ...user,
      loginRequestStatus: LOGIN_REQUEST_STATUS.APPROVED,
      loginToken: token,
    });
  }
}
