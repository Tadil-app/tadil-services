import { Alteration, AlterationsRepository } from '@tadil-alterations';
import { DbClient } from '../../dbClient';
export class PrismaAlterationsRepository implements AlterationsRepository {
  constructor(private readonly _db: DbClient) {}

  async getAlterationById(id: string): Promise<Alteration | undefined> {
    const alteration = await this._db.alteration.findUnique({
      where: { id },
      include: {
        sections: { select: { id: true } },
        informations: { select: { id: true } },
      },
    });

    if (!alteration) return undefined;
    return {
      ...alteration,
      sections: alteration.sections.map((section) => section.id),
      informations: alteration.informations.map(
        (information) => information.id
      ),
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
        price: Number(alteration.price),
        sections: {
          connect: alteration.sections.map((sectionId) => ({ id: sectionId })),
        },
        informations: {
          connect: alteration.informations.map((informationId) => ({
            id: informationId,
          })),
        },
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
        price: Number(alteration.price),
        sections: {
          set: alteration.sections.map((sectionId) => ({ id: sectionId })),
        },
        informations: {
          set: alteration.informations.map((informationId) => ({
            id: informationId,
          })),
        },
      },
    });
  }

  async deleteAlteration(id: string): Promise<void> {
    await this._db.alteration.delete({
      where: { id },
    });
  }
}
