import { Extra, ExtrasRepository } from '@tadil-extras';
import { DbClient } from '../../dbClient';
export class PrismaExtrasRepository implements ExtrasRepository {
  constructor(private readonly _db: DbClient) {}

  async getExtraById(id: string): Promise<Extra | undefined> {
    const extra = await this._db.extra.findUnique({
      where: { id }
    });

    if (!extra) return undefined;
    return extra
  }

  async createExtra(extra: Extra): Promise<void> {
    await this._db.extra.create({
      data: {
        id: extra.id,
        englishName: extra.englishName,
        arabicName: extra.arabicName,
        hindiName: extra.hindiName,
        urduName: extra.urduName,
        bengaliName: extra.bengaliName,
        price: Number(extra.price)
      },
    });
  }

  async updateExtra(extra: Extra): Promise<void> {
    await this._db.extra.update({
      where: { id: extra.id },
      data: {
        englishName: extra.englishName,
        arabicName: extra.arabicName,
        hindiName: extra.hindiName,
        urduName: extra.urduName,
        bengaliName: extra.bengaliName,
        price: Number(extra.price)
      },
    });
  }

  async deleteExtra(id: string): Promise<void> {
    await this._db.extra.delete({
      where: { id },
    });
  }
}
