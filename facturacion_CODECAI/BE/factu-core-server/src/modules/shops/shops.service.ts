import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Injectable()
export class ShopsService {
  private readonly logger = new Logger(ShopsService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateShopDto) {
    // Verificar si ya existe una tienda con ese RUC o email
    const existingShop = await this.prisma.shop.findFirst({
      where: {
        OR: [
          { ruc: data.ruc },
          { email: data.email },
        ],
      },
    });

    if (existingShop) {
      if (existingShop.ruc === data.ruc) {
        throw new ConflictException('Ya existe una tienda con ese RUC');
      }
      if (existingShop.email === data.email) {
        throw new ConflictException('Ya existe una tienda con ese email');
      }
    }

    // Si se proporcionan userIds, verificar que existan
    if (data.userIds && data.userIds.length > 0) {
      const users = await this.prisma.user.findMany({
        where: { id: { in: data.userIds } },
      });

      if (users.length !== data.userIds.length) {
        throw new BadRequestException('Algunos usuarios no existen');
      }
    }

    const { userIds, ...shopData } = data;

    try {
      const shop = await this.prisma.shop.create({
        data: {
          ...shopData,
          users: userIds && userIds.length > 0
            ? {
                create: userIds.map((userId) => ({
                  userId,
                })),
              }
            : undefined,
        },
        include: {
          users: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          _count: {
            select: { users: true },
          },
        },
      });

      this.logger.log(`Tienda creada: ${shop.name} (ID: ${shop.id})`);
      return shop;
    } catch (error) {
      this.logger.error('Error al crear tienda:', error);
      throw new BadRequestException('Error al crear la tienda');
    }
  }

  async findAll() {
    const shops = await this.prisma.shop.findMany({
      where: { isActive: true },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: { users: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    this.logger.debug(`${shops.length} tiendas encontradas`);
    return shops;
  }

  async findOne(id: number) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                role: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { users: true },
        },
      },
    });

    if (!shop) {
      throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
    }

    return shop;
  }

  async findShopsByUser(userId: number) {
    const shops = await this.prisma.shop.findMany({
      where: {
        users: {
          some: { userId },
        },
        isActive: true,
      },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    return shops;
  }

  async update(id: number, data: UpdateShopDto) {
    await this.findOne(id); // Verificar que existe

    // Verificar unicidad de RUC y email si se están actualizando
    if (data.ruc || data.email) {
      const existingShop = await this.prisma.shop.findFirst({
        where: {
          OR: [
            data.ruc ? { ruc: data.ruc } : {},
            data.email ? { email: data.email } : {},
          ],
          NOT: { id },
        },
      });

      if (existingShop) {
        if (existingShop.ruc === data.ruc) {
          throw new ConflictException('Ya existe otra tienda con ese RUC');
        }
        if (existingShop.email === data.email) {
          throw new ConflictException('Ya existe otra tienda con ese email');
        }
      }
    }

    const { userIds, ...shopData } = data;

    try {
      const shop = await this.prisma.shop.update({
        where: { id },
        data: shopData,
        include: {
          users: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          _count: {
            select: { users: true },
          },
        },
      });

      this.logger.log(`Tienda actualizada: ${shop.name} (ID: ${shop.id})`);
      return shop;
    } catch (error) {
      this.logger.error('Error al actualizar tienda:', error);
      throw new BadRequestException('Error al actualizar la tienda');
    }
  }

  async assignUsers(shopId: number, userIds: number[]) {
    await this.findOne(shopId); // Verificar que la tienda existe

    // Verificar que los usuarios existen
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });

    if (users.length !== userIds.length) {
      throw new BadRequestException('Algunos usuarios no existen');
    }

    try {
      // Eliminar asignaciones anteriores y crear las nuevas
      await this.prisma.userShop.deleteMany({
        where: { shopId },
      });

      await this.prisma.userShop.createMany({
        data: userIds.map((userId) => ({
          shopId,
          userId,
        })),
        skipDuplicates: true,
      });

      this.logger.log(`Usuarios asignados a tienda ID ${shopId}`);
      return this.findOne(shopId);
    } catch (error) {
      this.logger.error('Error al asignar usuarios:', error);
      throw new BadRequestException('Error al asignar usuarios a la tienda');
    }
  }

  async removeUserFromShop(shopId: number, userId: number) {
    await this.findOne(shopId);

    const userShop = await this.prisma.userShop.findFirst({
      where: { shopId, userId },
    });

    if (!userShop) {
      throw new NotFoundException('El usuario no está asignado a esta tienda');
    }

    await this.prisma.userShop.delete({
      where: { id: userShop.id },
    });

    this.logger.log(`Usuario ${userId} removido de tienda ${shopId}`);
    return { message: 'Usuario removido de la tienda exitosamente' };
  }

  async remove(id: number) {
    await this.findOne(id);

    // Soft delete - marcar como inactivo en lugar de eliminar
    const shop = await this.prisma.shop.update({
      where: { id },
      data: { isActive: false },
    });

    this.logger.log(`Tienda desactivada: ${shop.name} (ID: ${shop.id})`);
    return { message: 'Tienda desactivada exitosamente', shop };
  }

  async hardDelete(id: number) {
    await this.findOne(id);

    try {
      const shop = await this.prisma.shop.delete({
        where: { id },
      });

      this.logger.warn(`Tienda eliminada permanentemente: ${shop.name} (ID: ${shop.id})`);
      return { message: 'Tienda eliminada permanentemente' };
    } catch (error) {
      this.logger.error('Error al eliminar tienda:', error);
      throw new BadRequestException('No se puede eliminar la tienda porque tiene registros asociados');
    }
  }
}
