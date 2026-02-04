import { LoginSchema } from "../validations/loginSchema";
import { LoginResponse, RegisterData } from "@/types/auth";
import { apiFetch } from "@/app/services/api";

/**
 * Servicio de autenticación que conecta con el backend
 * Endpoints según CONFIGURATION.md:
 * - POST /auth/login
 * - POST /auth/register
 * - GET /auth/profile
 * - POST /auth/logout
 */

// Login: POST /auth/login
export async function loginService(data: LoginSchema): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Register: POST /auth/register
export async function registerService(data: RegisterData): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Get Profile: GET /auth/profile
export async function getProfileService(): Promise<{ id: number; email: string; roleId: number }> {
  return apiFetch("/auth/profile", {
    method: "GET",
  });
}

// Logout: POST /auth/logout
export async function logoutService(): Promise<{ message: string }> {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}
