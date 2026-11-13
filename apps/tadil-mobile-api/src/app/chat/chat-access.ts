import { MessageChannel } from '@prisma/client';
import type { DbClient } from '@tadil-database';

export interface OrderParticipants {
  customerId: string;
  assignedTailorId: string | null;
  assignedCourierId: string | null;
  assignedReturnCourierId: string | null;
}

export const CHAT_CHANNELS = Object.values(MessageChannel) as MessageChannel[];

export function isChatChannel(value: unknown): value is MessageChannel {
  return typeof value === 'string' && (CHAT_CHANNELS as string[]).includes(value);
}

/**
 * Who may read and write each order chat:
 * - TAILOR: the client and the assigned tailor
 * - COURIER: the client and the outbound or return driver
 * - TAILOR_COURIER: the assigned tailor and the outbound or return driver
 */
export function canAccessChat(
  order: OrderParticipants,
  channel: MessageChannel,
  userId: string
): boolean {
  if (!userId) return false;
  const isCustomer = order.customerId === userId;
  const isTailor = order.assignedTailorId === userId;
  const isCourier =
    order.assignedCourierId === userId || order.assignedReturnCourierId === userId;

  switch (channel) {
    case MessageChannel.TAILOR:
      return isCustomer || isTailor;
    case MessageChannel.COURIER:
      return isCustomer || isCourier;
    case MessageChannel.TAILOR_COURIER:
      return isTailor || isCourier;
    default:
      return false;
  }
}

/** The ids that decide chat access, or null when the order does not exist. */
export async function findOrderParticipants(
  db: DbClient,
  orderId: string
): Promise<OrderParticipants | null> {
  if (typeof orderId !== 'string' || !orderId) return null;
  return db.order.findUnique({
    where: { id: orderId },
    select: {
      customerId: true,
      assignedTailorId: true,
      assignedCourierId: true,
      assignedReturnCourierId: true,
    },
  });
}
