import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [ShopsController],
  providers: [ShopsService, PrismaService],
  exports: [ShopsService], // Exportar para usar en otros módulos
})
export class ShopsModule {}
