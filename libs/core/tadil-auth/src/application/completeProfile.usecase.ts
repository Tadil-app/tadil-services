import { InvalidCommandException } from '@tadil-common';
import { UsersRepository, User } from '@tadil-users';
import * as jwt from 'jsonwebtoken';

export class CompleteProfileUseCase {
  constructor(
    private readonly _usersRepository: UsersRepository,
    private readonly _jwtSecret: string
  ) {}

  async execute(phone: string, firstName: string, lastName: string): Promise<{ token: string; user: User }> {
    if (!phone || !firstName || !lastName) {
      throw new InvalidCommandException('Phone, first name, and last name are required');
    }

    const user = await this._usersRepository.getUserByPhone(phone);

    if (!user) {
      throw new InvalidCommandException('User not found');
    }

    const updatedUser = {
      ...user,
      firstName,
      lastName,
    };

    await this._usersRepository.updateUser(updatedUser);

    const token = jwt.sign(
      { sub: user.id, phone: user.phone, role: user.role },
      this._jwtSecret,
      { expiresIn: '30d' }
    );

    return { token, user: updatedUser };
  }
}
