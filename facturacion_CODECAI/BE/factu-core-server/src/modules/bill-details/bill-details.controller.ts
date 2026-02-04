import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BillDetailsService } from './bill-details.service';
import { CreateBillDetailDto } from './dto/create-bill-detail.dto';
import { UpdateBillDetailDto } from './dto/update-bill-detail.dto';

@Controller('bill-details')
export class BillDetailsController {
  constructor(private readonly billDetailsService: BillDetailsService) {}

  @Post()
  create(@Body() createBillDetailDto: CreateBillDetailDto) {
    return this.billDetailsService.create(createBillDetailDto);
  }

  @Get()
  findAll() {
    return this.billDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBillDetailDto: UpdateBillDetailDto) {
    return this.billDetailsService.update(+id, updateBillDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billDetailsService.remove(+id);
  }
}
