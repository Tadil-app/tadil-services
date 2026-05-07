import { InvalidCommandException } from '@tadil-common';
import { UsersRepository, User, ROLE, LOGIN_REQUEST_STATUS } from '@tadil-users';
import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

export type LoginStatus = 'authenticated' | 'signup_required' | 'pending' | 'rejected';

export interface LoginResponse {
  status: LoginStatus;
  token?: string;
  user?: User;
  message?: string;
}

export class LoginUseCase {
  constructor(
    private readonly _usersRepository: UsersRepository,
    private readonly _jwtSecret: string
  ) {}

  async execute(phone: string): Promise<LoginResponse> {
    if (!phone) {
      throw new InvalidCommandException('Phone is required');
    }

    let user = await this._usersRepository.getUserByPhone(phone);

    if (!user) {
      // Create skeleton customer
      user = {
        id: uuid(),
        phone,
        firstName: '',
        lastName: '',
        role: ROLE.CUSTOMER,
      };
      await this._usersRepository.createUser(user);
      return { status: 'signup_required', user };
    }

    if (user.role === ROLE.CUSTOMER) {
      // If customer is found but has no names, still redirect to signup
      if (!user.firstName || !user.lastName) {
        return { status: 'signup_required', user };
      }

      const token = this._generateToken(user);
      return { status: 'authenticated', token, user };
    }

    // For Tailors and Couriers
    if (user.loginToken) {
      const token = user.loginToken;
      const updatedUser = { ...user, loginToken: undefined, loginRequestStatus: undefined };
      await this._usersRepository.updateUser(updatedUser);
      return { status: 'authenticated', token, user: updatedUser };
    }

    if (user.loginRequestStatus === LOGIN_REQUEST_STATUS.REJECTED) {
      return { status: 'rejected', message: 'Your login request has been rejected by the admin.' };
    }

    if (user.loginRequestStatus === LOGIN_REQUEST_STATUS.PENDING) {
      return { status: 'pending', message: 'Your login request is still pending admin approval.' };
    }

    // Otherwise, initiate a new login request
    await this._usersRepository.updateUser({
      ...user,
      loginRequestStatus: LOGIN_REQUEST_STATUS.PENDING,
    });

    return { status: 'pending', message: 'Login request sent to admin. Please wait for approval.' };
  }

  private _generateToken(user: User): string {
    return jwt.sign(
      { sub: user.id, phone: user.phone, role: user.role },
      this._jwtSecret,
      { expiresIn: '30d' }
    );
  }
}
