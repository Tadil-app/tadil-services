import { Model, ModelImage, ModelsRepository, Section } from '@tadil-models';
import { DbClient } from '../../dbClient';

export class PrismaModelsRepository implements ModelsRepository {
  constructor(private readonly _db: DbClient) {}

  async getModelById(id: string): Promise<Model | undefined> {
    const model = await this._db.model.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!model) return undefined;

    return {
      ...model,
      images: model.images.map((image) => ({ ...image, sections: [] })),
    };
  }

  async createModel(model: Model): Promise<void> {
    await this._db.model.create({
      data: {
        id: model.id,
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

  async getModelImageById(
    id: string
  ): Promise<Omit<ModelImage, 'sections'> | undefined> {
    const modelImage = await this._db.modelImage.findUnique({
      where: { id },
    });
    if (!modelImage) return undefined;
    return modelImage;
  }

  async addModelImage(modelImage: ModelImage): Promise<void> {
    await this._db.modelImage.create({
      data: {
        id: modelImage.id,
        modelId: modelImage.modelId,
        fileId: modelImage.fileId,
      },
    });
  }

  async deleteModelImage(id: string): Promise<void> {
    await this._db.modelImage.delete({
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
        modelImageId: section.modelImageId,
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
