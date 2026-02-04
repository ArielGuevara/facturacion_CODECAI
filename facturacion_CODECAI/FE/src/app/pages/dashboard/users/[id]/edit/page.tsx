"use client";

import { useEffect, useState } from "react";
import { UserForm } from "@/components/users/user-form";
import { getUser } from "@/lib/services/userService";
import { User } from "@/types/user";
import { useParams } from "next/navigation";

export default function EditUserPage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // id comes as string | string[]
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (id) {
      getUser(parseInt(id))
        .then(setUser)
        .catch((err) => console.error("Error fetching user", err))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <div>Cargando usuario...</div>;
  if (!user) return <div>Usuario no encontrado</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight mb-4">Editar Usuario</h2>
      <UserForm initialData={user} />
    </div>
  );
}
