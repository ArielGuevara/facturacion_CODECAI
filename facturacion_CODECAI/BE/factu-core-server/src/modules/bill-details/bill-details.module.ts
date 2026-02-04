import { Module } from '@nestjs/common';
import { BillDetailsService } from './bill-details.service';
import { BillDetailsController } from './bill-details.controller';
import { PrismaService } from 'src/prisma.service'; 

@Module({
  controllers: [BillDetailsController],
  providers: [BillDetailsService, PrismaService],
})
export class BillDetailsModule {}
