import {
  InformationsRepository,
  Information,
  InformationType,
} from '@tadil-informations';
import { DbClient } from '../../dbClient';

export class PrismaInformationsRepository implements InformationsRepository {
  constructor(private readonly _db: DbClient) {}

  async getInformationById(id: string): Promise<Information | undefined> {
    const information = await this._db.information.findUnique({
      where: { id },
      include: {
        extras: { select: { id: true } },
      },
    });

    if (!information) return undefined;
    return {
      id: information.id,
      englishName: information.englishName,
      arabicName: information.arabicName,
      hindiName: information.hindiName,
      urduName: information.urduName,
      bengaliName: information.bengaliName,
      isRequired: information.isRequired,
      type: information.type as InformationType,
      unit: information.unit ?? undefined,
      extras: information.extras.map((extra) => extra.id),
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
        isRequired: information.isRequired,
        type: information.type,
        unit: information.unit,
        extras: {
          connect: information.extras.map((extraId) => ({ id: extraId })),
        },
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
        isRequired: information.isRequired,
        type: information.type,
        unit: information.unit,
        extras: {
          set: information.extras.map((extraId) => ({ id: extraId })),
        },
      },
    });
  }

  async deleteInformation(id: string): Promise<void> {
    await this._db.information.delete({
      where: { id },
    });
  }
}
