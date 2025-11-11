import { InformationsRepository, Information } from '@tadil-informations';
import { DbClient } from '../../dbClient';

export class PrismaInformationsRepository implements InformationsRepository {
  constructor(private readonly _db: DbClient) {}

  async getInformationById(id: string): Promise<Information | undefined> {
    const information = await this._db.information.findUnique({
      where: { id },
    });

    if (!information) return undefined;
    return {
      id: information.id,
      englishName: information.englishName,
      arabicName: information.arabicName,
      hindiName: information.hindiName,
      urduName: information.urduName,
      bengaliName: information.bengaliName,
      unit: information.unit ?? undefined,
    };
  }

  async createInformation(information: Information): Promise<void> {
    await this._db.information.create({
      data: {
        id: information.id,
        englishName: information.englishName,
        arabicName: information.arabicName,
        hindiName: information.hindiName,
        urduName: information.urduName,
        bengaliName: information.bengaliName,
        unit: information.unit,
      },
    });
  }

  async updateInformation(information: Information): Promise<void> {
    await this._db.information.update({
      where: { id: information.id },
      data: {
        englishName: information.englishName,
        arabicName: information.arabicName,
        hindiName: information.hindiName,
        urduName: information.urduName,
        bengaliName: information.bengaliName,
        unit: information.unit,
      },
    });
  }

  async deleteInformation(id: string): Promise<void> {
    await this._db.information.delete({
      where: { id },
    });
  }
}
