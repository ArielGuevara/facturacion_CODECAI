import { PartialType } from '@nestjs/mapped-types';
import { CreateBillDetailDto } from './create-bill-detail.dto';

export class UpdateBillDetailDto extends PartialType(CreateBillDetailDto) {}
