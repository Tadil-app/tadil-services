import { Model, ModelsRepository, Section } from '@tadil-models';
import { DbClient } from '../../dbClient';

export class PrismaModelsRepository implements ModelsRepository {
  constructor(private readonly _db: DbClient) {}

  async getModelById(id: string): Promise<Model | undefined> {
    const model = await this._db.model.findUnique({
      where: { id },
      include: { sections: true },
    });
    if (!model) return undefined;

    return model;
  }

  async createModel(model: Model): Promise<void> {
    await this._db.model.create({
      data: {
        id: model.id,
        imageFileId: model.imageFileId,
        englishName: model.englishName,
        arabicName: model.arabicName,
        hindiName: model.hindiName,
        urduName: model.urduName,
        bengaliName: model.bengaliName,
      },
    });
  }

  async updateModel(model: Model): Promise<void> {
    await this._db.model.update({
      where: { id: model.id },
      data: {
        imageFileId: model.imageFileId,
        englishName: model.englishName,
        arabicName: model.arabicName,
        hindiName: model.hindiName,
        urduName: model.urduName,
        bengaliName: model.bengaliName,
      },
    });
  }

  async deleteModel(id: string): Promise<void> {
    await this._db.model.delete({
      where: { id },
    });
  }

  async getSectionById(id: string): Promise<Section | undefined> {
    const section = await this._db.section.findUnique({
      where: { id },
    });

    if (!section) return undefined;
    return section;
  }

  async addSection(section: Section): Promise<void> {
    await this._db.section.create({
      data: {
        id: section.id,
        modelId: section.modelId,
        englishName: section.englishName,
        arabicName: section.arabicName,
        hindiName: section.hindiName,
        urduName: section.urduName,
        bengaliName: section.bengaliName,
        coordinates: section.coordinates,
      },
    });
  }

  async deleteSection(sectionId: string): Promise<void> {
    await this._db.section.delete({
      where: { id: sectionId },
    });
  }
}
