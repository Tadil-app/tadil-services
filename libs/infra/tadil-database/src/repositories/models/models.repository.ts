import { Model, ModelsRepository } from '@tadil-models';
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
}
