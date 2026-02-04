"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Eye, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { getBills, deleteBill } from "@/lib/services/invoiceService";
import { Bill } from "@/types/invoice";
import { toast } from "sonner";

export default function InvoicesPage() {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const data = await getBills();
      setBills(data);
    } catch (error) {
      console.error("Error cargando facturas:", error);
      toast.error("Error al cargar las facturas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDelete = async (id: number, billNumber: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la factura ${billNumber}?`)) {
      try {
        await deleteBill(id);
        toast.success("Factura eliminada correctamente");
        fetchBills(); // Recargar la lista
      } catch (error) {
        console.error("Error eliminando factura:", error);
        toast.error("Error al eliminar la factura");
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando facturas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Facturas</h2>
        <Button onClick={() => router.push("/pages/dashboard/invoices/create")}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Factura
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Facturación</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Número</th>
                            <th className="px-6 py-3">Usuario</th>
                            <th className="px-6 py-3">Fecha</th>
                            <th className="px-6 py-3">Items</th>
                            <th className="px-6 py-3 text-right">Total</th>
                            <th className="px-6 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill) => (
                            <tr key={bill.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium">{bill.billNumber}</td>
                                <td className="px-6 py-4">
                                  {bill.user ? `${bill.user.firstName} ${bill.user.lastName}` : 'N/A'}
                                </td>
                                <td className="px-6 py-4">{formatDate(bill.date)}</td>
                                <td className="px-6 py-4">
                                  {bill.details ? bill.details.length : 0} item(s)
                                </td>
                                <td className="px-6 py-4 text-right font-bold">${bill.grandTotal.toFixed(2)}</td>
                                <td className="px-6 py-4 text-center space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => router.push(`/pages/dashboard/invoices/${bill.id}`)}
                                      title="Ver detalles"
                                    >
                                        <Eye className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleDelete(bill.id, bill.billNumber)}
                                      title="Eliminar"
                                    >
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {bills.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                                    No hay facturas registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
