import { Extra } from './extra.model';

export interface ExtrasRepository {
  getExtraById(id: string): Promise<Extra | undefined>;
  createExtra(extra: Extra): Promise<void>;
  updateExtra(extra: Extra): Promise<void>;
  deleteExtra(id: string): Promise<void>;
}
