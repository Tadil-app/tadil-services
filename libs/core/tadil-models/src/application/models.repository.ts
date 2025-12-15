import { Model, ModelImage, Section } from './model.model';

export interface ModelsRepository {
  getModelById(id: string): Promise<Model | undefined>;
  createModel(model: Omit<Model, 'images'>): Promise<void>;
  updateModel(model: Omit<Model, 'images'>): Promise<void>;
  deleteModel(id: string): Promise<void>;
  getModelImageById(
    id: string
  ): Promise<Omit<ModelImage, 'sections'> | undefined>;
  addModelImage(modelImage: Omit<ModelImage, 'sections'>): Promise<void>;
  deleteModelImage(id: string): Promise<void>;
  getSectionById(id: string): Promise<Section | undefined>;
  addSection(section: Section): Promise<void>;
  deleteSection(sectionId: string): Promise<void>;
}
