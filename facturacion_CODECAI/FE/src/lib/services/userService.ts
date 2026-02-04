import { User, UserFormValues } from "@/types/user";
import { apiFetch } from "@/app/services/api";

/**
 * Servicio de usuarios que conecta con el backend
 * Endpoints según CONFIGURATION.md:
 * - POST /users - Crear usuario (Solo Admin)
 * - GET /users - Listar todos (Solo Admin)
 * - GET /users/me - Obtener mi perfil (Autenticado)
 * - GET /users/:id - Obtener por ID (Autenticado)
 * - PATCH /users/:id - Actualizar (Solo Admin)
 * - DELETE /users/:id - Eliminar (Solo Admin)
 */

// Listar todos los usuarios: GET /users
export async function getUsers(): Promise<User[]> {
    return apiFetch<User[]>("/users", {
        method: "GET",
    });
}

// Obtener mi perfil: GET /users/me
export async function getMyProfile(): Promise<User> {
    return apiFetch<User>("/users/me", {
        method: "GET",
    });
}

// Obtener usuario por ID: GET /users/:id
export async function getUser(id: number): Promise<User> {
    return apiFetch<User>(`/users/${id}`, {
        method: "GET",
    });
}

// Crear usuario: POST /users
export async function createUser(data: UserFormValues): Promise<User> {
    return apiFetch<User>("/users", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// Actualizar usuario: PATCH /users/:id
export async function updateUser(id: number, data: Partial<UserFormValues>): Promise<User> {
    return apiFetch<User>(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

// Eliminar usuario: DELETE /users/:id
export async function deleteUser(id: number): Promise<void> {
    return apiFetch<void>(`/users/${id}`, {
        method: "DELETE",
    });
}
