import { Order, OrdersRepository } from '@tadil-orders';
import { DbClient } from '../../dbClient';
import { OrderStatus } from '@prisma/client';

export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly _db: DbClient) {}

  async create(order: Order): Promise<void> {
    await this._db.order.create({
      data: {
        id: order.id,
        reference: order.reference,
        date: order.date,
        totalPrice: order.totalPrice,
        status: order.status as OrderStatus,
        customerId: order.customerId,
        addressId: order.addressId,
        history: {
          create: {
            status: order.status as OrderStatus,
          },
        },
        items: {
          create: order.items.map((item) => ({
            id: item.id,
            price: item.price,
            englishName: '', // These should probably be passed or fetched, but for now we prioritize the ID and price
            arabicName: '',
            urduName: '',
            hindiName: '',
            bengaliName: '',
            imageFileId: '', 
            sections: {
              create: item.sections.map((section: any) => ({
                id: section.id,
                englishName: section.englishName,
                arabicName: section.arabicName,
                urduName: section.urduName,
                hindiName: section.hindiName,
                bengaliName: section.bengaliName,
                imageFileId: '',
                coordinates: [],
                alterations: {
                  create: section.alterations.map((alt: any) => ({
                    id: alt.id,
                    englishName: alt.englishName,
                    arabicName: alt.arabicName,
                    urduName: alt.urduName,
                    hindiName: alt.hindiName,
                    bengaliName: alt.bengaliName,
                    price: alt.price,
                    informations: {
                      create: alt.informations.map((info: any) => ({
                        id: info.id,
                        englishName: info.englishName,
                        arabicName: info.arabicName,
                        urduName: info.urduName,
                        hindiName: info.hindiName,
                        bengaliName: info.bengaliName,
                        type: info.type,
                        unit: info.unit,
                        value: info.value,
                      })),
                    },
                  })),
                },
              })),
            },
          })),
        },
        customItems: {
          create: order.customItems.map((item) => ({
            id: item.id,
            price: item.price,
            imageFileId: '',
            alterations: {
              create: item.alterations.map((alt: any) => ({
                id: alt.id,
                englishName: alt.englishName,
                arabicName: alt.arabicName,
                urduName: alt.urduName,
                hindiName: alt.hindiName,
                bengaliName: alt.bengaliName,
                price: alt.price,
                informations: {
                  create: alt.informations.map((info: any) => ({
                    id: info.id,
                    englishName: info.englishName,
                    arabicName: info.arabicName,
                    urduName: info.urduName,
                    hindiName: info.hindiName,
                    bengaliName: info.bengaliName,
                    type: info.type,
                    unit: info.unit,
                    value: info.value,
                  })),
                },
              })),
            },
          })),
        },
      },
    });
  }

  async getById(id: string): Promise<Order | undefined> {
    const order = await this._db.order.findUnique({
      where: { id },
      include: {
        items: { include: { sections: { include: { alterations: { include: { informations: true } } } } } },
        customItems: { include: { alterations: { include: { informations: true } } } },
      },
    });

    if (!order) return undefined;

    return order as any; // Map appropriately if needed
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this._db.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
        history: {
          create: {
            status: status as OrderStatus,
          },
        },
      },
    });
  }

  async assignTailor(id: string, tailorId: string): Promise<void> {
    await this._db.order.update({
      where: { id },
      data: {
        status: OrderStatus.waitingForCourierAssignement,
        assignedTailorId: tailorId,
        history: {
          create: {
            status: OrderStatus.waitingForCourierAssignement,
          },
        },
      },
    });
  }
}
