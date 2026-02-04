import { Role } from "@/types/user";
import { apiFetch } from "@/app/services/api";

/**
 * Servicio de roles que conecta con el backend
 * Endpoints según CONFIGURATION.md:
 * - POST /roles - Crear rol (Solo Admin)
 * - GET /roles - Listar todos (Solo Admin)
 * - GET /roles/:id - Obtener por ID (Solo Admin)
 * - PATCH /roles/:id - Actualizar (Solo Admin)
 * - DELETE /roles/:id - Eliminar (Solo Admin)
 */

// Listar todos los roles: GET /roles
export async function getRoles(): Promise<Role[]> {
    return apiFetch<Role[]>("/roles", {
        method: "GET",
    });
}

// Obtener rol por ID: GET /roles/:id
export async function getRole(id: number): Promise<Role> {
    return apiFetch<Role>(`/roles/${id}`, {
        method: "GET",
    });
}

// Crear rol: POST /roles
export async function createRole(name: string): Promise<Role> {
    return apiFetch<Role>("/roles", {
        method: "POST",
        body: JSON.stringify({ name }),
    });
}

// Actualizar rol: PATCH /roles/:id
export async function updateRole(id: number, name: string): Promise<Role> {
    return apiFetch<Role>(`/roles/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
    });
}

// Eliminar rol: DELETE /roles/:id
export async function deleteRole(id: number): Promise<void> {
    return apiFetch<void>(`/roles/${id}`, {
        method: "DELETE",
    });
}
