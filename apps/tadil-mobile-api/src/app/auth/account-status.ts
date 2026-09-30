import { UnauthorizedException } from '@nestjs/common';
import { DbClient } from '@tadil-database';
import { isDeletedAccountPhone } from '@tadil-users';
import { WsException } from '@nestjs/websockets';

export async function assertAccountActive(
  db: DbClient,
  sub: unknown
): Promise<void> {
  if (typeof sub !== 'string' || !sub) {
    throw new UnauthorizedException();
  }
  const user = await db.user.findUnique({
    where: { id: sub },
    select: { phone: true },
  });
  if (!user || isDeletedAccountPhone(user.phone)) {
    throw new UnauthorizedException();
  }
}

export async function assertSocketAccountActive(
  db: DbClient,
  sub: unknown
): Promise<void> {
  try {
    await assertAccountActive(db, sub);
  } catch {
    throw new WsException('Unauthorized');
  }
}
