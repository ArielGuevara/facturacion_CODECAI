import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { BillDetailsService } from './bill-details.service';
import { CreateBillDetailDto } from './dto/create-bill-detail.dto';
import { UpdateBillDetailDto } from './dto/update-bill-detail.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';

@Controller('bill-details')
@UseGuards(AuthGuard)
export class BillDetailsController {
  constructor(private readonly billDetailsService: BillDetailsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBillDetailDto: CreateBillDetailDto) {
    return this.billDetailsService.create(createBillDetailDto);
  }

  @Get()
  findAll() {
    return this.billDetailsService.findAll();
  }

  @Get('bill/:billId')
  findByBillId(@Param('billId', ParseIntPipe) billId: number) {
    return this.billDetailsService.findByBillId(billId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.billDetailsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateBillDetailDto: UpdateBillDetailDto
  ) {
    return this.billDetailsService.update(id, updateBillDetailDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.billDetailsService.remove(id);
  }
}
