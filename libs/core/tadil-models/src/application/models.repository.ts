import { Model, Section } from './model.model';

export interface ModelsRepository {
  getModelById(id: string): Promise<Model | undefined>;
  createModel(model: Model): Promise<void>;
  updateModel(model: Model): Promise<void>;
  deleteModel(id: string): Promise<void>;
  getSectionById(id: string): Promise<Section | undefined>;
  addSection(section: Section): Promise<void>;
  deleteSection(sectionId: string): Promise<void>;
}
