import { BillDetail } from '../../bill-details/entities/bill-detail.entity';
import { User } from '../../users/entities/user.entity';

export class Bill {
    id: number;
    billNumber: string;
    date: Date;
    grandTotal: number;
    userId: number;
    user?: User;
    details?: BillDetail[];
}
