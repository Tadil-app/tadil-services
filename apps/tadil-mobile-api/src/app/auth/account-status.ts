import { UnauthorizedException } from '@nestjs/common';
import { DbClient } from '@tadil-database';
import { isDeletedAccountPhone } from '@tadil-users';
import { WsException } from '@nestjs/websockets';
import type { JwtPayload } from 'jsonwebtoken';

export async function assertAccountActive(
  db: DbClient,
  payload: string | JwtPayload
): Promise<void> {
  const sub = typeof payload === 'string' ? undefined : payload.sub;
  if (typeof sub !== 'string' || !sub) {
    throw new UnauthorizedException();
  }
  const user = await db.user.findUnique({
    where: { id: sub },
    select: { phone: true, sessionsValidAfter: true },
  });
  if (!user || isDeletedAccountPhone(user.phone)) {
    throw new UnauthorizedException();
  }
  if (!isSessionValid((payload as JwtPayload).iat, user.sessionsValidAfter)) {
    throw new UnauthorizedException();
  }
}

/** iat is in whole seconds; sessionsValidAfter is stored truncated to seconds. */
export function isSessionValid(iat: number | undefined, validAfter: Date | null): boolean {
  if (!validAfter) return true;
  return typeof iat === 'number' && iat * 1000 >= validAfter.getTime();
}

/** Logout time, truncated to seconds so a token issued later that second still works. */
export function sessionCutoff(now = Date.now()): Date {
  return new Date(Math.floor(now / 1000) * 1000);
}

export async function assertSocketAccountActive(
  db: DbClient,
  payload: string | JwtPayload
): Promise<void> {
  try {
    await assertAccountActive(db, payload);
  } catch {
    throw new WsException('Unauthorized');
  }
}
