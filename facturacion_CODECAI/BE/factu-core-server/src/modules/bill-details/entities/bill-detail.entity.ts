import {Bill} from '../../bill/entities/bill.entity';

export class BillDetail {
    id: number;
    name: string;
    amount: number;
    description: string;
    itemPrice: number;
    totalItem: number;
    billId: number;
    bill: Bill;
}
