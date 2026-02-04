import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@Injectable()
export class BillService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calcula el grandTotal de una factura sumando todos sus detalles
   */
  async calculateGrandTotal(billId: number): Promise<number> {
    const details = await this.prisma.billDetails.findMany({
      where: { billId }
    });

    return details.reduce((sum, detail) => sum + detail.totalItem, 0);
  }

  /**
   * Actualiza el grandTotal de una factura
   */
  async updateGrandTotal(billId: number): Promise<void> {
    const grandTotal = await this.calculateGrandTotal(billId);
    
    await this.prisma.bill.update({
      where: { id: billId },
      data: { grandTotal }
    });
  }

  async create(data: CreateBillDto) {
    try {
      // Verificar que el usuario existe
      const userExists = await this.prisma.user.findUnique({
        where: { id: data.userId }
      });

      if (!userExists) {
        throw new NotFoundException(`Usuario con ID ${data.userId} no encontrado`);
      }

      // Verificar que el número de factura no esté duplicado
      const existingBill = await this.prisma.bill.findFirst({
        where: { billNumber: data.billNumber }
      });

      if (existingBill) {
        throw new BadRequestException(`El número de factura ${data.billNumber} ya existe`);
      }

      // Si no se proporciona grandTotal, inicializar en 0
      const billData = {
        ...data,
        date: data.date instanceof Date ? data.date : new Date(data.date),
        grandTotal: data.grandTotal ?? 0
      };

      return await this.prisma.bill.create({ 
        data: billData,
        include: { 
          details: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error detallado al crear factura:', error);
      throw new BadRequestException(`Error al crear la factura: ${error.message}`);
    }
  }

  async findAll() {
    return await this.prisma.bill.findMany({
      include: { 
        details: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
  }

  async findOne(id: number) {
    const bill = await this.prisma.bill.findUnique({ 
      where: { id },
      include: { 
        details: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!bill) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    return bill;
  }

  async findByUser(userId: number) {
    return await this.prisma.bill.findMany({
      where: { userId },
      include: { 
        details: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
  }

  async findByBillNumber(billNumber: string) {
    const bill = await this.prisma.bill.findFirst({
      where: { billNumber },
      include: { 
        details: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!bill) {
      throw new NotFoundException(`Factura con número ${billNumber} no encontrada`);
    }

    return bill;
  }

  async update(id: number, data: UpdateBillDto) {
    // Verificar que la factura existe
    await this.findOne(id);

    try {
      // Si se actualiza el userId, verificar que el usuario existe
      if (data.userId) {
        const userExists = await this.prisma.user.findUnique({
          where: { id: data.userId }
        });

        if (!userExists) {
          throw new NotFoundException(`Usuario con ID ${data.userId} no encontrado`);
        }
      }

      // Si se actualiza el billNumber, verificar que no esté duplicado
      if (data.billNumber) {
        const existingBill = await this.prisma.bill.findFirst({
          where: { 
            billNumber: data.billNumber,
            NOT: { id }
          }
        });

        if (existingBill) {
          throw new BadRequestException(`El número de factura ${data.billNumber} ya existe`);
        }
      }

      return await this.prisma.bill.update({ 
        where: { id }, 
        data,
        include: { 
          details: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar la factura');
    }
  }

  async remove(id: number) {
    // Verificar que la factura existe
    await this.findOne(id);

    try {
      // Primero eliminar los detalles de la factura
      await this.prisma.billDetails.deleteMany({
        where: { billId: id }
      });

      // Luego eliminar la factura
      return await this.prisma.bill.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException('Error al eliminar la factura');
    }
  }
}
