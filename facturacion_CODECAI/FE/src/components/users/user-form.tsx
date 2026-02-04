"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, UserFormValues, userSchema, Role } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createUser, updateUser } from "@/lib/services/userService";
import { getRoles } from "@/lib/services/roleService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface UserFormProps {
  initialData?: User;
}

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Cargar roles del backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error("Error cargando roles:", error);
        toast.error("Error al cargar los roles");
        // Roles por defecto si falla
        setRoles([
          { id: 1, name: "Administrador" },
          { id: 2, name: "Gerente" },
        ]);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema) as any,
    defaultValues: initialData
      ? {
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          email: initialData.email,
          password: "", // Don't pre-fill password
          documentType: initialData.documentType,
          documentNumber: initialData.documentNumber,
          phoneNumber: initialData.phoneNumber,
          address: initialData.address,
          roleId: initialData.roleId,
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          documentType: "Cédula",
          documentNumber: "",
          phoneNumber: "",
          address: "",
          roleId: 2, // Default to non-admin role
        },
  });

  const onSubmit = async (data: UserFormValues) => {
    setError(null);
    try {
      if (initialData) {
        // Edit mode
        const { password, ...rest } = data;
        const updateData = password ? data : rest; // Only send password if changed
        await updateUser(initialData.id, updateData);
        toast.success("Usuario actualizado correctamente");
      } else {
        // Create mode
        await createUser(data);
        toast.success("Usuario creado correctamente");
      }
      router.push("/pages/dashboard/users");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error saving user";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Editar Usuario" : "Crear Usuario"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input id="firstName" {...form.register("firstName")} />
              {form.formState.errors.firstName && (
                <p className="text-red-500 text-sm">{form.formState.errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input id="lastName" {...form.register("lastName")} />
              {form.formState.errors.lastName && (
                <p className="text-red-500 text-sm">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email && (
                <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña {initialData && "(Dejar vacía para no cambiar)"}</Label>
            <Input id="password" type="password" {...form.register("password")} />
             {form.formState.errors.password && (
                <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
            )}
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Tipo Documento</Label>
               <select
                id="documentType"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...form.register("documentType")}
              >
                <option value="Cédula">Cédula</option>
                <option value="RUC">RUC</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
               {form.formState.errors.documentType && (
                <p className="text-red-500 text-sm">{form.formState.errors.documentType.message}</p>
            )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentNumber">Número Documento</Label>
              <Input id="documentNumber" {...form.register("documentNumber")} />
               {form.formState.errors.documentNumber && (
                <p className="text-red-500 text-sm">{form.formState.errors.documentNumber.message}</p>
            )}
            </div>
           </div>


          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Teléfono</Label>
            <Input id="phoneNumber" {...form.register("phoneNumber")} />
             {form.formState.errors.phoneNumber && (
                <p className="text-red-500 text-sm">{form.formState.errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" {...form.register("address")} />
             {form.formState.errors.address && (
                <p className="text-red-500 text-sm">{form.formState.errors.address.message}</p>
            )}
          </div>
            
           <div className="space-y-2">
              <Label htmlFor="roleId">Rol</Label>
               <select
                id="roleId"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...form.register("roleId")}
                disabled={loadingRoles}
              >
                {loadingRoles ? (
                  <option>Cargando roles...</option>
                ) : (
                  roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))
                )}
              </select>
               {form.formState.errors.roleId && (
                <p className="text-red-500 text-sm">{form.formState.errors.roleId.message}</p>
            )}
            </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" form="user-form" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </CardFooter>
    </Card>
  );
}
