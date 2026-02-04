import { IsString, IsNumber, IsInt, IsPositive, Min, IsOptional } from 'class-validator';

export class CreateBillDetailDto {
    @IsString()
    name: string;

    @IsInt()
    @Min(1)
    amount: number;

    @IsString()
    description: string;

    @IsNumber()
    @IsPositive()
    itemPrice: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    totalItem?: number;

    @IsInt()
    @IsPositive()
    billId: number;
}
