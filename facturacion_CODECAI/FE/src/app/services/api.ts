// Base URL del backend (puerto 3001 según CONFIGURATION.md)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper para obtener el token desde las cookies
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

// Función genérica para hacer peticiones al backend
export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getCookie('auth_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  // Agregar token de autenticación si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = `Error ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = await res.text() || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Si la respuesta es 204 No Content, retornar objeto vacío
  if (res.status === 204) {
    return {} as T;
  }

  return (await res.json()) as T;
}
