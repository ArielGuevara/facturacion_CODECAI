import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBillDetailDto } from './dto/create-bill-detail.dto';
import { UpdateBillDetailDto } from './dto/update-bill-detail.dto';

@Injectable()
export class BillDetailsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateBillDetailDto) {
    return this.prisma.billDetails.create({ data });
  }

  findAll() {
    return this.prisma.billDetails.findMany({
      include: { bill: true}
    });
  }

  findOne(id: number) {
    return this.prisma.billDetails.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateBillDetailDto) {
    return this.prisma.billDetails.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.billDetails.delete({ where: { id } });
  }
}
