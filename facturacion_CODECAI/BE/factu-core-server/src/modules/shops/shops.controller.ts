import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  ParseArrayPipe,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  // Solo administradores pueden crear tiendas
  @Post()
  @Roles('Administrador')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopsService.create(createShopDto);
  }

  // Todos los usuarios autenticados pueden ver las tiendas
  @Get()
  @Roles('Administrador')
  findAll() {
    return this.shopsService.findAll();
  }

  // Obtener tiendas asignadas al usuario actual
  @Get('my-shops')
  getMyShops(@CurrentUser() user: JwtPayload) {
    return this.shopsService.findShopsByUser(user.sub);
  }

  // Obtener una tienda específica
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shopsService.findOne(id);
  }

  // Solo administradores pueden actualizar tiendas
  @Patch(':id')
  @Roles('Administrador')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShopDto: UpdateShopDto,
  ) {
    return this.shopsService.update(id, updateShopDto);
  }

  // Asignar usuarios a una tienda
  @Post(':id/assign-users')
  @Roles('Administrador')
  assignUsers(
    @Param('id', ParseIntPipe) id: number,
    @Body('userIds', new ParseArrayPipe({ items: Number, separator: ',' }))
    userIds: number[],
  ) {
    return this.shopsService.assignUsers(id, userIds);
  }

  // Remover un usuario de una tienda
  @Delete(':shopId/users/:userId')
  @Roles('Administrador')
  removeUserFromShop(
    @Param('shopId', ParseIntPipe) shopId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.shopsService.removeUserFromShop(shopId, userId);
  }

  // Soft delete - Solo administradores
  @Delete(':id')
  @Roles('Administrador')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shopsService.remove(id);
  }

  // Hard delete - Solo administradores (opcional, comentar si no se quiere permitir)
  @Delete(':id/permanent')
  @Roles('Administrador')
  @HttpCode(HttpStatus.OK)
  hardDelete(@Param('id', ParseIntPipe) id: number) {
    return this.shopsService.hardDelete(id);
  }
}
