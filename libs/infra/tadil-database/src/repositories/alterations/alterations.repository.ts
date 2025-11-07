import { AlterationsRepository, Alteration } from '@tadil-alterations';
import { DbClient } from '../../dbClient';

export class PrismaAlterationsRepository implements AlterationsRepository {
  constructor(private readonly _db: DbClient) {}

  async getAlterationById(id: string): Promise<Alteration | undefined> {
    const alteration = await this._db.alteration.findUnique({
      where: { id },
    });

    if (!alteration) return undefined;
    return {
      id: alteration.id,
      englishName: alteration.englishName,
      arabicName: alteration.arabicName,
      hindiName: alteration.hindiName,
      urduName: alteration.urduName,
      bengaliName: alteration.bengaliName,
      value: alteration.value ?? undefined,
      unit: alteration.unit ?? undefined,
    };
  }

  async createAlteration(alteration: Alteration): Promise<void> {
    await this._db.alteration.create({
      data: {
        id: alteration.id,
        englishName: alteration.englishName,
        arabicName: alteration.arabicName,
        hindiName: alteration.hindiName,
        urduName: alteration.urduName,
        bengaliName: alteration.bengaliName,
        value: alteration.value,
        unit: alteration.unit,
      },
    });
  }

  async updateAlteration(alteration: Alteration): Promise<void> {
    await this._db.alteration.update({
      where: { id: alteration.id },
      data: {
        englishName: alteration.englishName,
        arabicName: alteration.arabicName,
        hindiName: alteration.hindiName,
        urduName: alteration.urduName,
        bengaliName: alteration.bengaliName,
        value: alteration.value,
        unit: alteration.unit,
      },
    });
  }

  async deleteAlteration(id: string): Promise<void> {
    await this._db.alteration.delete({
      where: { id },
    });
  }
}
