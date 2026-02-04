import { Shop } from '../../shops/entities/shop.entity';

export class User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    document_type: string;
    document_number: string;
    phone_number: string;
    address: string;
    shops?: Shop[];
    roleId: number;
    createdAt?: Date;
    updatedAt?: Date;
}
