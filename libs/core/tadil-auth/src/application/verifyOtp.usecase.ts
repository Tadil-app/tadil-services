import { InvalidCommandException } from '@tadil-common';
import { OtpsRepository } from './otps.repository';
import { UsersRepository, User, ROLE } from '@tadil-users';
import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

export class VerifyOtpUseCase {
  constructor(
    private readonly _otpsRepository: OtpsRepository,
    private readonly _usersRepository: UsersRepository,
    private readonly _jwtSecret: string
  ) {}

  async execute(phone: string, code: string): Promise<{ token: string; user: User }> {
    if (!phone || !code) {
      throw new InvalidCommandException('Phone and code are required');
    }

    const latestOtp = await this._otpsRepository.getLatestByPhone(phone);

    if (!latestOtp || latestOtp.code !== code) {
      throw new InvalidCommandException('Invalid OTP code');
    }

    if (new Date() > latestOtp.expiresAt) {
      throw new InvalidCommandException('OTP code expired');
    }

    // Mark OTP as used (delete it)
    await this._otpsRepository.delete(latestOtp.id);

    let user = await this._usersRepository.getUserByPhone(phone);

    if (!user) {
      // Create a default user for first time mobile users if they don't exist
      // In a real app, you might want a separate registration step
      // For now, we'll create a basic customer
      user = {
        id: uuid(),
        phone,
        firstName: 'New',
        lastName: 'User',
        role: ROLE.CUSTOMER,
      };
      await this._usersRepository.createUser(user);
    }

    // Generate persistent token (e.g. 30 days for mobile)
    const token = jwt.sign(
      { sub: user.id, phone: user.phone, role: user.role },
      this._jwtSecret,
      { expiresIn: '30d' }
    );

    return { token, user };
  }
}
