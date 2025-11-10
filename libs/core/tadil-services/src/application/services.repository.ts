import { Service } from './service.model';

export interface ServicesRepository {
  getServiceById(id: string): Promise<Service | undefined>;
  createService(service: Service): Promise<void>;
  updateService(service: Service): Promise<void>;
  deleteService(id: string): Promise<void>;
}
