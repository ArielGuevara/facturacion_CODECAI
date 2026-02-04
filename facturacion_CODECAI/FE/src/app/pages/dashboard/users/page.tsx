"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { getUsers, deleteUser } from "@/lib/services/userService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await deleteUser(id);
        toast.success("Usuario eliminado correctamente");
        fetchUsers();
      } catch (error) {
        console.error(error);
        toast.error("Error al eliminar el usuario");
      }
    }
  };

  if (loading) return <div>Cargando usuarios...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h2>
        <Button onClick={() => router.push("/pages/dashboard/users/create")}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Rol</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium decoration-slice">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.role?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/pages/dashboard/users/${user.id}/edit`)}>
                            <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                            <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
