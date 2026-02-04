export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
    role?: {
      id: number;
      name: string;
    };
    documentType: string;
    documentNumber: string;
    phoneNumber: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  documentType: string;
  documentNumber: string;
  phoneNumber: string;
  address: string;
}
