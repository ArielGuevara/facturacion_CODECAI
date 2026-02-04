// Detalle de factura (BillDetails del backend)
export interface BillDetail {
    id: number;
    name: string;
    amount: number; // cantidad
    description: string;
    itemPrice: number; // precio unitario
    totalItem: number; // calculado: amount * itemPrice
    billId: number;
}

// Factura (Bill del backend)
export interface Bill {
    id: number;
    billNumber: string;
    date: string;
    grandTotal: number; // calculado automáticamente
    userId: number;
    user?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    details?: BillDetail[];
}

// Formulario para crear factura
export interface CreateBillData {
    billNumber: string;
    date: string;
    userId: number;
}

// Formulario para crear detalle de factura
export interface CreateBillDetailData {
    name: string;
    amount: number;
    description: string;
    itemPrice: number;
    billId: number;
}

// Legacy types para compatibilidad (pueden eliminarse luego)
export interface InvoiceItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Invoice {
    id: string;
    customerName: string;
    customerRuc: string;
    customerAddress: string;
    date: string;
    items: InvoiceItem[];
    subtotal0: number;
    subtotal12: number;
    iva: number;
    total: number;
    status: "Pagada" | "Pendiente";
}
