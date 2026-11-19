import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from './jwt-secret';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { DbClient } from '@tadil-database';
import { assertSocketAccountActive } from './account-status';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly _db: DbClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromHandshake(client);

    if (!token) {
      throw new WsException('Unauthorized');
    }

    try {
      const secret = jwtSecret();
      const payload = jwt.verify(token, secret);
      await assertSocketAccountActive(this._db, payload);
      // @ts-expect-error - we are adding user to the client object
      client.user = payload;
    } catch {
      throw new WsException('Unauthorized');
    }

    return true;
  }

  private extractTokenFromHandshake(client: Socket): string | undefined {
    // Check both auth header and query param
    const authHeader = client.handshake.headers.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer') return token;
    }

    const token = client.handshake.auth?.token || client.handshake.query?.token;
    return token as string | undefined;
  }
}
