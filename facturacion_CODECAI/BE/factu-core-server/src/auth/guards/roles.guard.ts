import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No hay roles requeridos
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Obtener el rol del usuario desde la base de datos
    const userWithRole = await this.prisma.user.findUnique({
      where: { id: user.sub },
      include: { role: true },
    });

    if (!userWithRole || !userWithRole.role) {
      throw new ForbiddenException('Rol de usuario no encontrado');
    }

    const hasRole = requiredRoles.includes(userWithRole.role.name);

    if (!hasRole) {
      this.logger.warn(
        `Usuario ${user.email} intentó acceder sin permisos suficientes`,
      );
      throw new ForbiddenException(
        `Requiere uno de estos roles: ${requiredRoles.join(', ')}`,
      );
    }

    this.logger.debug(
      `Usuario ${user.email} autorizado con rol ${userWithRole.role.name}`,
    );
    return true;
  }
}