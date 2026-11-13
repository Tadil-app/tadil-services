import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DataReader } from '@tadil-database';
import { WaybillDTO, WaybillNamesDTO } from './waybill.dto';

export type WaybillViewer = 'tailor' | 'courier';

const names = (n: any): WaybillNamesDTO => ({
  englishName: n.englishName,
  arabicName: n.arabicName,
  urduName: n.urduName,
  hindiName: n.hindiName,
  bengaliName: n.bengaliName,
});

const informations = (alteration: any) =>
  (alteration.informations ?? []).map((info: any) => ({
    ...names(info),
    type: info.type,
    value: info.value,
    unit: info.unit ?? null,
    extraDetails: info.extraDetails ? names(info.extraDetails) : null,
  }));

/**
 * Builds the waybill for an order. Only the assigned tailor, or a driver
 * assigned to either leg, may print it: it carries both parties' phones.
 */
export async function buildWaybill(
  dataReader: DataReader,
  orderId: string,
  viewer: WaybillViewer,
  userId: string
): Promise<WaybillDTO> {
  const order: any = await dataReader.queries.order.findUnique({
    where: { id: orderId },
    include: {
      address: true,
      customer: { select: { firstName: true, lastName: true, phone: true } },
      assignedTailor: {
        select: {
          firstName: true,
          lastName: true,
          phone: true,
          addresses: { take: 1 },
        },
      },
      items: {
        include: {
          sections: {
            include: { alterations: { include: { informations: true } } },
          },
        },
      },
      customItems: {
        include: { alterations: { include: { informations: true } } },
      },
    },
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  const allowed =
    viewer === 'tailor'
      ? order.assignedTailorId === userId
      : order.assignedCourierId === userId || order.assignedReturnCourierId === userId;
  if (!userId || !allowed) {
    throw new ForbiddenException();
  }

  const pieces = [
    ...order.items.map((item: any) => ({
      names: names(item),
      alterations: item.sections.flatMap((section: any) =>
        section.alterations.map((alteration: any) => ({
          ...names(alteration),
          informations: informations(alteration),
        }))
      ),
    })),
    ...order.customItems.map((item: any) => ({
      names: null,
      alterations: item.alterations.map((alteration: any) => ({
        ...names(alteration),
        informations: informations(alteration),
      })),
    })),
  ];

  const tailor = order.assignedTailor;

  return {
    orderId: order.id,
    orderReference: order.reference,
    orderDate: order.date,
    customer: {
      name: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
      phone: order.customer.phone,
      address: order.address ?? null,
    },
    tailor: tailor
      ? {
          name: `${tailor.firstName} ${tailor.lastName}`.trim(),
          phone: tailor.phone,
          address: tailor.addresses?.[0] ?? null,
        }
      : null,
    pieces,
  };
}
