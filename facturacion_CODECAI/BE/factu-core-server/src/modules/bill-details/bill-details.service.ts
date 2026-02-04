import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateBillDetailDto } from './dto/create-bill-detail.dto';
import { UpdateBillDetailDto } from './dto/update-bill-detail.dto';
import { BillService } from '../bill/bill.service';

@Injectable()
export class BillDetailsService {
  constructor(
    private prisma: PrismaService,
    private billService: BillService
  ) {}

  /**
   * Recalcula y actualiza el grandTotal de una factura
   */
  private async updateBillGrandTotal(billId: number): Promise<void> {
    await this.billService.updateGrandTotal(billId);
  }

  async create(data: CreateBillDetailDto) {
    try {
      // Verificar que la factura existe
      const billExists = await this.prisma.bill.findUnique({
        where: { id: data.billId }
      });

      if (!billExists) {
        throw new NotFoundException(`Factura con ID ${data.billId} no encontrada`);
      }

      // Calcular totalItem automáticamente si no se proporciona
      const billDetailData = {
        ...data,
        totalItem: data.totalItem ?? (data.amount * data.itemPrice)
      };

      const billDetail = await this.prisma.billDetails.create({ data: billDetailData });

      // Recalcular el grandTotal de la factura
      await this.updateBillGrandTotal(data.billId);

      return billDetail;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el detalle de factura');
    }
  }

  async findAll() {
    return await this.prisma.billDetails.findMany({
      include: { bill: true }
    });
  }

  async findOne(id: number) {
    const billDetail = await this.prisma.billDetails.findUnique({ 
      where: { id },
      include: { bill: true }
    });

    if (!billDetail) {
      throw new NotFoundException(`Detalle de factura con ID ${id} no encontrado`);
    }

    return billDetail;
  }

  async findByBillId(billId: number) {
    return await this.prisma.billDetails.findMany({
      where: { billId },
      include: { bill: true }
    });
  }

  async update(id: number, data: UpdateBillDetailDto) {
    // Verificar que el detalle existe
    const existingDetail = await this.findOne(id);

    try {
      // Si se actualiza el billId, verificar que la nueva factura existe
      if (data.billId) {
        const billExists = await this.prisma.bill.findUnique({
          where: { id: data.billId }
        });

        if (!billExists) {
          throw new NotFoundException(`Factura con ID ${data.billId} no encontrada`);
        }
      }

      // Calcular totalItem si se actualizaron amount o itemPrice
      const updateData: any = { ...data };
      
      // Si se proporciona amount o itemPrice, recalcular totalItem
      if (data.amount !== undefined || data.itemPrice !== undefined) {
        const finalAmount = data.amount ?? existingDetail.amount;
        const finalItemPrice = data.itemPrice ?? existingDetail.itemPrice;
        updateData.totalItem = finalAmount * finalItemPrice;
      }

      const updatedDetail = await this.prisma.billDetails.update({ 
        where: { id }, 
        data: updateData,
        include: { bill: true }
      });

      // Recalcular el grandTotal de la factura original
      await this.updateBillGrandTotal(existingDetail.billId);

      // Si cambió de factura, también actualizar la nueva factura
      if (data.billId && data.billId !== existingDetail.billId) {
        await this.updateBillGrandTotal(data.billId);
      }

      return updatedDetail;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar el detalle de factura');
    }
  }

  async remove(id: number) {
    // Verificar que el detalle existe
    const detail = await this.findOne(id);

    try {
      await this.prisma.billDetails.delete({ where: { id } });

      // Recalcular el grandTotal de la factura
      await this.updateBillGrandTotal(detail.billId);

      return detail;
    } catch (error) {
      throw new BadRequestException('Error al eliminar el detalle de factura');
    }
  }
}
