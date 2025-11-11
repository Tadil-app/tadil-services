import { Information } from './information.model';

export interface InformationsRepository {
  getInformationById(id: string): Promise<Information | undefined>;
  createInformation(information: Information): Promise<void>;
  updateInformation(information: Information): Promise<void>;
  deleteInformation(id: string): Promise<void>;
}
