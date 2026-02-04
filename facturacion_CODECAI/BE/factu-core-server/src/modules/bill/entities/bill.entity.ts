import { BillDetail } from '../../bill-details/entities/bill-detail.entity';


export class Bill {
    billNumber: string;
    date: Date;
    grandTotal: number;
    userId: number;
    details?: BillDetail[];
}
