import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../constants/metadata.constants';
import { Reflector } from '@nestjs/core';
import { CacheService } from '../src/services/cache.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();

    if (isPublic) {
      if (request.headers.merchantid) {
        request.headers.merchantid = parseInt(request.headers.merchantid);

        request.headers.woocommercekeys = await this.cacheService.getCacheValue(
          request.headers.merchantid,
        );

        const userToken = this.extractUserToken(request);
        if (userToken) {
          const payload = await this.jwtService.verifyAsync(userToken, {
            secret: this.configService.get('jwt_secret'),
          });

          request.headers.userid = payload.id;
        }
      }

      return true;
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({ status: 401 });
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt_secret'),
      });
      const keys = await this.cacheService.getCacheValue(payload.id.toString());

      request.headers.merchantid = payload.id;
      request.headers.woocommercekeys = keys;

      const userToken = this.extractUserToken(request);
      if (userToken) {
        const payload = await this.jwtService.verifyAsync(userToken, {
          secret: this.configService.get('jwt_secret'),
        });

        request.headers.userid = payload.id;
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.cookies.accessToken;
  }

  private extractUserToken(request: Request): string | undefined {
    return request.headers.authorization;
  }
}
