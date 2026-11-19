import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from './jwt-secret';
import { Request } from 'express';
import { DbClient } from '@tadil-database';
import { assertAccountActive } from './account-status';

interface AuthenticatedRequest extends Request {
  user?: string | jwt.JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly _db: DbClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const secret = jwtSecret();
      const payload = jwt.verify(token, secret);
      await assertAccountActive(this._db, payload);
      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: AuthenticatedRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
