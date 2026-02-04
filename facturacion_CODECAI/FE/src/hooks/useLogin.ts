"use client";

import { useState } from "react";
import { loginService } from "@/lib/services/authService";
import { LoginSchema } from "@/lib/validations/loginSchema";
import { LoginResponse } from "@/types/auth";

export function useLogin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginSchema): Promise<LoginResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await loginService(data);
      // Aquí podrías guardar el token en cookies o localStorage
      console.log("Usuario autenticado:", response);

      return response;
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
