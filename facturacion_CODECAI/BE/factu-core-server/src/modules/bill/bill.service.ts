import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@Injectable()
export class BillService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateBillDto) {
    return this.prisma.bill.create({ data });
  }

  findAll() {
    return this.prisma.bill.findMany({
      include: { details: true }
    });
  }

  findOne(id: number) {
    return this.prisma.bill.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateBillDto) {
    return this.prisma.bill.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.bill.delete({ where: { id } });
  }
}
