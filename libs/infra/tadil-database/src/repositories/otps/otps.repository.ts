import { Otp, OtpsRepository } from '@tadil-auth';
import { DbClient } from '../../dbClient';

export class PrismaOtpsRepository implements OtpsRepository {
  constructor(private readonly _db: DbClient) {}

  async save(otp: Otp): Promise<void> {
    await this._db.otp.create({
      data: {
        id: otp.id,
        code: otp.code,
        phone: otp.phone,
        expiresAt: otp.expiresAt,
        createdAt: otp.createdAt,
        userId: otp.userId,
      },
    });
  }

  async getLatestByPhone(phone: string): Promise<Otp | undefined> {
    const otp = await this._db.otp.findFirst({
      where: { phone },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) return undefined;

    return {
      ...otp,
      userId: otp.userId ?? undefined,
    };
  }

  async delete(id: string): Promise<void> {
    await this._db.otp.delete({
      where: { id },
    });
  }

  async deleteExpired(): Promise<void> {
    await this._db.otp.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
