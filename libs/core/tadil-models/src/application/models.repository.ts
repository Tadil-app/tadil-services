import { Model } from './model.model';

export interface ModelsRepository {
  getModelById(id: string): Promise<Model | undefined>;
  createModel(model: Model): Promise<void>;
  updateModel(model: Model): Promise<void>;
  deleteModel(id: string): Promise<void>;
}
