import { z } from "zod";

export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    documentType: string;
    documentNumber: string;
    phoneNumber: string;
    address: string;
    roleId: number;
    role?: Role;
    createdAt?: string;
    updatedAt?: string;
}

// Schema matching CreateUserDto
export const userSchema = z.object({
    firstName: z.string().min(1, "El nombre es obligatorio"),
    lastName: z.string().min(1, "El apellido es obligatorio"),
    email: z.string().email("Email inválido"),
    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(
            /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
            "La contraseña debe contener mayúsculas, minúsculas y números o caracteres especiales"
        )
        .optional()
        .or(z.literal("")), // Optional for updates
    documentType: z.string().min(1, "Tipo de documento obligatorio"),
    documentNumber: z
        .string()
        .min(1, "Número de documento obligatorio")
        .regex(/^[0-9]+$/, "Solo números"),
    phoneNumber: z.string().min(1, "Teléfono obligatorio"),
    address: z.string().min(1, "Dirección obligatoria"),
    roleId: z.coerce.number().min(1, "Rol obligatorio"),
});

export type UserFormValues = z.infer<typeof userSchema>;
