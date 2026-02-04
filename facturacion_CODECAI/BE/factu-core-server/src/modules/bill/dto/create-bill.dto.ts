import { IsNotEmpty, IsOptional, IsPositive, IsDateString, Matches, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class CreateBillDto {
    @IsNotEmpty()
    @Matches(/^[0-9]+$/)
    billNumber: string;

    @IsNotEmpty()
    @Type(() => Date)
    date: Date;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    grandTotal?: number;

    @IsNotEmpty()
    @IsPositive()
    userId: number;
}
