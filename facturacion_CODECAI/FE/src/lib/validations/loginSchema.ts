import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Debe ser un email válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(8, "Debe tener al menos 8 caracteres"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
