import { v4 as uuid } from 'uuid';
import { OtpsRepository } from './otps.repository';
import { InvalidCommandException, SmsService } from '@tadil-common';

export class RequestOtpUseCase {
  constructor(
    private readonly _otpsRepository: OtpsRepository,
    private readonly _smsService: SmsService,
  ) {}

  async execute(phone: string): Promise<void> {
    if (!phone) {
      throw new InvalidCommandException('Phone is required');
    }

    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minutes expiry

    await this._otpsRepository.save({
      id: uuid(),
      code,
      phone,
      expiresAt,
      createdAt: new Date(),
    });

    await this._smsService.send(phone, `Your Tadil verification code is: ${code}`);
  }
}
