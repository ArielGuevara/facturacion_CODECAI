"use client";

import { UserForm } from "@/components/users/user-form";

export default function CreateUserPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight mb-4">Crear Nuevo Usuario</h2>
      <UserForm />
    </div>
  );
}
