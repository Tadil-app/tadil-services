import { Order } from '@tadil-common';

export interface OrdersRepository {
  create(order: Order): Promise<void>;
  getById(id: string): Promise<Order | undefined>;
  updateStatus(id: string, status: string): Promise<void>;
  assignTailor(id: string, tailorId: string): Promise<void>;
}
