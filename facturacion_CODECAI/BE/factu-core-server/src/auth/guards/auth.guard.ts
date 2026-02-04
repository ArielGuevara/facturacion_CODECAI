import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verificar si la ruta es pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('Token no proporcionado');
      throw new UnauthorizedException('Token de autenticación requerido');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException('Token inválido');
      }

      // Verificar si el token está cerca de expirar 
      if (payload.exp) {
        const expirationTime = payload.exp * 1000; 
        const currentTime = Date.now();
        const timeUntilExpiration = expirationTime - currentTime;

        // Si quedan menos de 5 minutos, emitir un warning
        if (timeUntilExpiration < 5 * 60 * 1000) {
          this.logger.warn(
            `Token para usuario ${payload.email} está próximo a expirar, por favor volverse a logear`,
          );
        }
      }

      // Asignar payload al request
      request.user = payload;

      this.logger.debug(`Usuario autenticado: ${payload.email}`);
      return true;
    } catch (error) {
      this.logger.error('Error al verificar token:', error.message);

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token ha expirado');
      }

      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido');
      }

      throw new UnauthorizedException('Error al verificar autenticación');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      this.logger.warn('Tipo de autenticación no soportado');
      return undefined;
    }

    return token;
  }
}