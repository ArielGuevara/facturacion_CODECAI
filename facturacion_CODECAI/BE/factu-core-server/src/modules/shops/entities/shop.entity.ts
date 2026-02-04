export class Shop {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  country: string;
  city: string;
  ruc: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Campos opcionales para cuando se incluyen relaciones
  _count?: {
    users: number;
  };
}
