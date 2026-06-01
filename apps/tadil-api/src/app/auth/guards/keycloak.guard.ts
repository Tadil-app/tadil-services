import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  private readonly logger = new Logger(KeycloakAuthGuard.name);

  // In a real app, these would come from ConfigService
  private readonly introspectionUrl = process.env.KEYCLOAK_INTROSPECTION_URL;
  private readonly clientId = process.env.KEYCLOAK_CLIENT_ID;
  private readonly clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    if(!this.introspectionUrl || !this.clientId || !this.clientSecret) {
      this.logger.error('Keycloak configuration is missing');
      throw new UnauthorizedException('Authentication configuration error');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const response = await fetch(this.introspectionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          token: token,
        }),
      });

      if (!response.ok) {
        this.logger.error(`Keycloak introspection failed: ${response.statusText}`);
        throw new UnauthorizedException('Invalid token');
      }

      const data = await response.json() as any;

      if (!data.active) {
        throw new UnauthorizedException('Token is not active');
      }

      // Attach the user info to the request object for later use
      // ts-expect-error - we are adding a custom property to the request object
      request['user'] = {
        id: data.sub,
        username: data.preferred_username,
        email: data.email,
        roles: data.realm_access?.roles || [],
      };

      return true;
    } catch (error) {
      this.logger.error('Error validating token', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
