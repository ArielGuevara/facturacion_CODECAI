import { apiFetch } from "@/app/services/api";

/**
 * Servicio de tiendas que conecta con el backend
 * Endpoints según CONFIGURATION.md:
 * - POST /shops - Crear tienda (Solo Admin)
 * - GET /shops - Listar todas (Solo Admin)
 * - GET /shops/my-shops - Mis tiendas (Autenticado)
 * - GET /shops/:id - Obtener por ID (Autenticado)
 * - PATCH /shops/:id - Actualizar (Solo Admin)
 * - POST /shops/:id/assign-users - Asignar usuarios (Solo Admin)
 * - DELETE /shops/:shopId/users/:userId - Remover usuario (Solo Admin)
 * - DELETE /shops/:id - Eliminar (soft delete) (Solo Admin)
 * - DELETE /shops/:id/permanent - Eliminar permanentemente (Solo Admin)
 */

export interface Shop {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    country: string;
    city: string;
    ruc: string;
    email: string;
    isActive: boolean;
    users?: UserShop[];
    createdAt?: string;
    updatedAt?: string;
}

export interface UserShop {
    id: number;
    userId: number;
    shopId: number;
    user?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    assignedAt?: string;
}

export interface CreateShopData {
    name: string;
    address: string;
    phoneNumber: string;
    country: string;
    city: string;
    ruc: string;
    email: string;
    userIds?: number[];
}

// Crear tienda: POST /shops
export async function createShop(data: CreateShopData): Promise<Shop> {
    return apiFetch<Shop>("/shops", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// Listar todas las tiendas: GET /shops
export async function getShops(): Promise<Shop[]> {
    return apiFetch<Shop[]>("/shops", {
        method: "GET",
    });
}

// Obtener mis tiendas: GET /shops/my-shops
export async function getMyShops(): Promise<Shop[]> {
    return apiFetch<Shop[]>("/shops/my-shops", {
        method: "GET",
    });
}

// Obtener tienda por ID: GET /shops/:id
export async function getShop(id: number): Promise<Shop> {
    return apiFetch<Shop>(`/shops/${id}`, {
        method: "GET",
    });
}

// Actualizar tienda: PATCH /shops/:id
export async function updateShop(id: number, data: Partial<CreateShopData>): Promise<Shop> {
    return apiFetch<Shop>(`/shops/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

// Asignar usuarios a tienda: POST /shops/:id/assign-users
export async function assignUsersToShop(shopId: number, userIds: number[]): Promise<{ message: string; assignments: UserShop[] }> {
    return apiFetch(`/shops/${shopId}/assign-users`, {
        method: "POST",
        body: JSON.stringify({ userIds }),
    });
}

// Remover usuario de tienda: DELETE /shops/:shopId/users/:userId
export async function removeUserFromShop(shopId: number, userId: number): Promise<{ message: string }> {
    return apiFetch(`/shops/${shopId}/users/${userId}`, {
        method: "DELETE",
    });
}

// Eliminar tienda (soft delete): DELETE /shops/:id
export async function deleteShop(id: number): Promise<{ message: string; shop: Shop }> {
    return apiFetch(`/shops/${id}`, {
        method: "DELETE",
    });
}

// Eliminar tienda permanentemente: DELETE /shops/:id/permanent
export async function deleteShopPermanently(id: number): Promise<{ message: string }> {
    return apiFetch(`/shops/${id}/permanent`, {
        method: "DELETE",
    });
}
