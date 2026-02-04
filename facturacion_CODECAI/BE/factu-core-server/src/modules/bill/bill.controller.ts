import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('bill')
@UseGuards(AuthGuard)
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  @Roles('Administrador', 'Gerente')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBillDto: CreateBillDto) {
    return this.billService.create(createBillDto);
  }

  @Get()
  @Roles('Administrador', 'Gerente')
  findAll() {
    return this.billService.findAll();
  }

  @Get('user/:userId')
  @Roles('Administrador', 'Gerente')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.billService.findByUser(userId);
  }

  @Get('bill-number/:billNumber')
  @Roles('Administrador', 'Gerente')
  findByBillNumber(@Param('billNumber') billNumber: string) {
    return this.billService.findByBillNumber(billNumber);
  }

  @Get(':id')
  @Roles('Administrador', 'Gerente')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.billService.findOne(id);
  }

  @Patch(':id')
  @Roles('Administrador', 'Gerente')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateBillDto: UpdateBillDto
  ) {
    return this.billService.update(id, updateBillDto);
  }

  @Delete(':id')
  @Roles('Administrador')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.billService.remove(id);
  }
}
