import { DbClient } from '@tadil-database';
import { toPushLocale } from './messages';

export type DevicePlatform = 'ios' | 'android';

export class DeviceTokens {
  constructor(private readonly _db: DbClient) {}

  /** Links this phone to the user; a phone shared by two accounts follows the latest sign-in. */
  async register(userId: string, token: string, platform: DevicePlatform, locale?: string): Promise<void> {
    const data = { userId, platform, locale: toPushLocale(locale) };
    await this._db.deviceToken.upsert({
      where: { token },
      create: { token, ...data },
      update: data,
    });
  }

  /** Stops pushes to this phone (sign-out). Only the owner can remove it. */
  async unregister(userId: string, token: string): Promise<void> {
    await this._db.deviceToken.deleteMany({ where: { token, userId } });
  }
}
