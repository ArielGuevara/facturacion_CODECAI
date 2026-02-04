import { LoginSchema } from "../validations/loginSchema";
import { LoginResponse } from "@/types/auth";

export async function loginService(data: LoginSchema): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const message = (await res.json())?.message || "Error al iniciar sesión";
    throw new Error(message);
  }

  return res.json() as Promise<LoginResponse>;
}
