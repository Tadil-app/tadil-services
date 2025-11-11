import { Alteration } from './alteration.model';

export interface AlterationsRepository {
  getAlterationById(id: string): Promise<Alteration | undefined>;
  createAlteration(alteration: Alteration): Promise<void>;
  updateAlteration(alteration: Alteration): Promise<void>;
  deleteAlteration(id: string): Promise<void>;
}
