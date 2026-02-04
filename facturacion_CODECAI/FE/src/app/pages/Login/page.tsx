"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { loginService } from "@/lib/services/authService";
import { useState } from "react";

// --- SCHEMA con zod ---
const loginSchema = z.object({
  email: z.string().email("El email no es válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // --- react-hook-form ---
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      const response = await loginService(data);
      // Set cookie (simple implementation)
      document.cookie = `auth_token=${response.access_token}; path=/; max-age=3600; SameSite=Lax`;
      router.push("/pages/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden bg-zinc-900 lg:flex lg:flex-col lg:justify-between lg:p-12 text-white relative overflow-hidden">
        {/* Abstract subtle background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 opacity-80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
            <h1 className="text-2xl font-bold tracking-tight">FACTURACIÓN CODECAI</h1>
        </div>

        <div className="relative z-10 max-w-md">
            <blockquote className="space-y-2">
                <p className="text-lg">
                "La eficiencia financiera es la clave para desbloquear el potencial de crecimiento de tu empresa."
                </p>
                <footer className="text-sm text-zinc-400">Platforma de Gestión Integral</footer>
            </blockquote>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex items-center justify-center py-12 px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Bienvenido</CardTitle>
                <CardDescription className="text-zinc-500 dark:text-zinc-400">
                    Ingresa tus credenciales para acceder al panel
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Corporativo</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="nombre@empresa.com"
                            className="bg-white/80 dark:bg-zinc-950/50"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Contraseña</Label>
                            <a href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            className="bg-white/80 dark:bg-zinc-950/50"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm text-center border border-red-200">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-900" disabled={isSubmitting}>
                        {isSubmitting ? "Autenticando..." : "Ingresar al Sistema"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <div className="text-sm text-zinc-500">
                    ¿No tienes acceso? <a href="#" className="font-semibold text-zinc-900 hover:underline dark:text-zinc-50">Solicitar cuenta</a>
                </div>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
