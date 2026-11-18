import { InvalidCommandException } from '@tadil-common';
import { UsersRepository, User, ROLE, isDeletedAccountPhone } from '@tadil-users';
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
    if (isDeletedAccountPhone(phone)) {
      throw new InvalidCommandException('This account has been deleted');
    }

    const user = await this._usersRepository.getUserByPhone(phone);

    if (!user) {
      throw new InvalidCommandException('User not found');
    }

    // This only finishes a new customer's signup, the `signup_required` state
    // of /login. Tailors and drivers need the admin's approval, and an account
    // that already has a name is not a signup to finish.
    if (user.role !== ROLE.CUSTOMER || (user.firstName && user.lastName)) {
      throw new InvalidCommandException('This account cannot complete a signup');
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
