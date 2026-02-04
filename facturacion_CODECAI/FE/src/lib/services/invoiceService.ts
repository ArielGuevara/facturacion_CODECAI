import { Invoice, Bill, BillDetail, CreateBillData, CreateBillDetailData } from "@/types/invoice";
import { apiFetch } from "@/app/services/api";

/**
 * Servicio de facturas que conecta con el backend
 * Endpoints según CONFIGURATION.md:
 * Bill (Factura):
 * - POST /bill - Crear factura
 * - GET /bill - Listar todas
 * - GET /bill/user/:userId - Por usuario
 * - GET /bill/bill-number/:billNumber - Por número
 * - GET /bill/:id - Por ID
 * - PATCH /bill/:id - Actualizar
 * - DELETE /bill/:id - Eliminar
 * 
 * Bill Details (Detalles):
 * - POST /bill-details - Crear detalle
 * - GET /bill-details - Listar todos
 * - GET /bill-details/bill/:billId - Por factura
 * - GET /bill-details/:id - Por ID
 * - PATCH /bill-details/:id - Actualizar
 * - DELETE /bill-details/:id - Eliminar
 */

// ===== BILLS (FACTURAS) =====

// Crear factura: POST /bill
export async function createBill(data: CreateBillData): Promise<Bill> {
    return apiFetch<Bill>("/bill", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// Listar todas las facturas: GET /bill
export async function getBills(): Promise<Bill[]> {
    return apiFetch<Bill[]>("/bill", {
        method: "GET",
    });
}

// Obtener facturas por usuario: GET /bill/user/:userId
export async function getBillsByUser(userId: number): Promise<Bill[]> {
    return apiFetch<Bill[]>(`/bill/user/${userId}`, {
        method: "GET",
    });
}

// Obtener factura por número: GET /bill/bill-number/:billNumber
export async function getBillByNumber(billNumber: string): Promise<Bill> {
    return apiFetch<Bill>(`/bill/bill-number/${billNumber}`, {
        method: "GET",
    });
}

// Obtener factura por ID: GET /bill/:id
export async function getBill(id: number): Promise<Bill> {
    return apiFetch<Bill>(`/bill/${id}`, {
        method: "GET",
    });
}

// Actualizar factura: PATCH /bill/:id
export async function updateBill(id: number, data: Partial<CreateBillData>): Promise<Bill> {
    return apiFetch<Bill>(`/bill/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

// Eliminar factura: DELETE /bill/:id
export async function deleteBill(id: number): Promise<void> {
    return apiFetch<void>(`/bill/${id}`, {
        method: "DELETE",
    });
}

// ===== BILL DETAILS (DETALLES DE FACTURA) =====

// Crear detalle: POST /bill-details
export async function createBillDetail(data: CreateBillDetailData): Promise<BillDetail> {
    return apiFetch<BillDetail>("/bill-details", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// Listar todos los detalles: GET /bill-details
export async function getBillDetails(): Promise<BillDetail[]> {
    return apiFetch<BillDetail[]>("/bill-details", {
        method: "GET",
    });
}

// Obtener detalles por factura: GET /bill-details/bill/:billId
export async function getBillDetailsByBill(billId: number): Promise<BillDetail[]> {
    return apiFetch<BillDetail[]>(`/bill-details/bill/${billId}`, {
        method: "GET",
    });
}

// Obtener detalle por ID: GET /bill-details/:id
export async function getBillDetail(id: number): Promise<BillDetail> {
    return apiFetch<BillDetail>(`/bill-details/${id}`, {
        method: "GET",
    });
}

// Actualizar detalle: PATCH /bill-details/:id
export async function updateBillDetail(id: number, data: Partial<CreateBillDetailData>): Promise<BillDetail> {
    return apiFetch<BillDetail>(`/bill-details/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

// Eliminar detalle: DELETE /bill-details/:id
export async function deleteBillDetail(id: number): Promise<void> {
    return apiFetch<void>(`/bill-details/${id}`, {
        method: "DELETE",
    });
}

// ===== LEGACY FUNCTIONS (para compatibilidad con código existente) =====

// Mock Data (Burnt Invoices) - mantener por si se necesita para desarrollo
const SEEDED_INVOICES: Invoice[] = [
    {
        id: "001-001-000000123",
        customerName: "Juan Perez",
        customerRuc: "1723456789",
        customerAddress: "Av. 10 de Agosto y Colon",
        date: "2024-12-15",
        items: [
            { id: 1, name: "Laptop Dell", quantity: 1, price: 800, total: 800 },
            { id: 2, name: "Mouse Logitech", quantity: 1, price: 25, total: 25 },
        ],
        subtotal0: 0,
        subtotal12: 825,
        iva: 123.75,
        total: 948.75,
        status: "Pagada",
    },
    {
        id: "001-001-000000124",
        customerName: "Empresa XYZ",
        customerRuc: "1791234567001",
        customerAddress: "Calle Principal 123",
        date: "2024-12-16",
        items: [
            { id: 4, name: "Servicio Instalación", quantity: 2, price: 30, total: 60 },
        ],
        subtotal0: 60,
        subtotal12: 0,
        iva: 0,
        total: 60,
        status: "Pendiente",
    },
    {
        id: "001-001-000000125",
        customerName: "Maria Lopez",
        customerRuc: "1711223344",
        customerAddress: "Quito, Sector Norte",
        date: "2024-12-17",
        items: [
            { id: 3, name: "Teclado Mecánico", quantity: 1, price: 60, total: 60 },
        ],
        subtotal0: 0,
        subtotal12: 60,
        iva: 9,
        total: 69,
        status: "Pagada",
    },
];

const STORAGE_KEY = "factu_invoices";

export const getInvoices = (): Invoice[] => {
    if (typeof window === "undefined") return SEEDED_INVOICES;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEEDED_INVOICES));
        return SEEDED_INVOICES;
    }
    return JSON.parse(stored);
};

export const saveInvoice = (invoice: Invoice): void => {
    if (typeof window === "undefined") return;
    const current = getInvoices();
    const updated = [invoice, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const generateInvoiceId = (): string => {
    const suffix = Date.now().toString().slice(-9);
    return `001-001-${suffix}`;
};
