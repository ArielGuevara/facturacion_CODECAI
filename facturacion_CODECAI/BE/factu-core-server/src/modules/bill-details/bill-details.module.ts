import { Module } from '@nestjs/common';
import { BillDetailsService } from './bill-details.service';
import { BillDetailsController } from './bill-details.controller';
import { PrismaService } from 'src/prisma.service';
import { BillModule } from '../bill/bill.module';

@Module({
  imports: [BillModule],
  controllers: [BillDetailsController],
  providers: [BillDetailsService, PrismaService],
})
export class BillDetailsModule {}
