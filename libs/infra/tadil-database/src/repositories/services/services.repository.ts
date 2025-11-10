import { Service, ServicesRepository } from '@tadil-services';
import { DbClient } from '../../dbClient';
export class PrismaServicesRepository implements ServicesRepository {
  constructor(private readonly _db: DbClient) {}

  async getServiceById(id: string): Promise<Service | undefined> {
    const service = await this._db.service.findUnique({
      where: { id },
      include: {
        sections: { select: { id: true } },
        alterations: { select: { id: true } },
      },
    });

    if (!service) return undefined;
    return {
      ...service,
      sections: service.sections.map((section) => section.id),
      alterations: service.alterations.map((alteration) => alteration.id),
    };
  }

  async createService(service: Service): Promise<void> {
    await this._db.service.create({
      data: {
        id: service.id,
        englishName: service.englishName,
        arabicName: service.arabicName,
        hindiName: service.hindiName,
        urduName: service.urduName,
        bengaliName: service.bengaliName,
        price: Number(service.price),
        sections: {
          connect: service.sections.map((sectionId) => ({ id: sectionId })),
        },
        alterations: {
          connect: service.alterations.map((alterationId) => ({
            id: alterationId,
          })),
        },
      },
    });
  }

  async updateService(service: Service): Promise<void> {
    await this._db.service.update({
      where: { id: service.id },
      data: {
        englishName: service.englishName,
        arabicName: service.arabicName,
        hindiName: service.hindiName,
        urduName: service.urduName,
        bengaliName: service.bengaliName,
        price: Number(service.price),
        sections: {
          connect: service.sections.map((sectionId) => ({ id: sectionId })),
        },
        alterations: {
          connect: service.alterations.map((alterationId) => ({
            id: alterationId,
          })),
        },
      },
    });
  }

  async deleteService(id: string): Promise<void> {
    await this._db.service.delete({
      where: { id },
    });
  }
}
