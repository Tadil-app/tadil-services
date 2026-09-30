import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { environment } from '../../environments/environment';
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
      const secret = environment.jwtSecret || 'super-secret';
      const payload = jwt.verify(token, secret);
      const sub = typeof payload === 'string' ? undefined : payload.sub;
      await assertAccountActive(this._db, sub);
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
