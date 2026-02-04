import { IsNotEmpty, IsPositive, IsDateString, Matches } from "class-validator";

export class CreateBillDto {
    @IsNotEmpty()
    @Matches(/^[0-9]+$/)
    billNumber: string;

    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsPositive()
    grandTotal: number;

    @IsNotEmpty()
    @IsPositive()
    userId: number;
}
