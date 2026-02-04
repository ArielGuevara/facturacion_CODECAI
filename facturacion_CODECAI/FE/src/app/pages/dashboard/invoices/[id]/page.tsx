"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bill } from "@/types/invoice";
import { getBill } from "@/lib/services/invoiceService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (id) {
          const data = await getBill(parseInt(id));
          setBill(data);
        }
      } catch (error) {
        console.error("Error cargando factura:", error);
        toast.error("Error al cargar la factura");
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando factura...</div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Factura no encontrada</p>
            <Button 
              className="mt-4"
              onClick={() => router.push("/pages/dashboard/invoices")}
            >
              Volver a facturas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => router.push("/pages/dashboard/invoices")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" /> Generar PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Factura #{bill.billNumber}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información de la factura */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Información General</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Número:</span> {bill.billNumber}</p>
                <p><span className="font-medium">Fecha:</span> {formatDate(bill.date)}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Usuario</h3>
              <div className="space-y-1">
                {bill.user ? (
                  <>
                    <p><span className="font-medium">Nombre:</span> {bill.user.firstName} {bill.user.lastName}</p>
                    <p><span className="font-medium">Email:</span> {bill.user.email}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">No disponible</p>
                )}
              </div>
            </div>
          </div>

          {/* Detalles de la factura */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Detalles de la Factura</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Producto/Servicio</th>
                    <th className="px-4 py-3 text-left">Descripción</th>
                    <th className="px-4 py-3 text-right">Cantidad</th>
                    <th className="px-4 py-3 text-right">Precio Unit.</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {bill.details && bill.details.length > 0 ? (
                    bill.details.map((detail) => (
                      <tr key={detail.id}>
                        <td className="px-4 py-3 font-medium">{detail.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{detail.description}</td>
                        <td className="px-4 py-3 text-right">{detail.amount}</td>
                        <td className="px-4 py-3 text-right">${detail.itemPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-medium">${detail.totalItem.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No hay detalles registrados para esta factura
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/3 space-y-2">
              <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 dark:border-gray-600">
                <span className="text-lg font-bold">TOTAL:</span>
                <span className="text-2xl font-bold text-primary">
                  ${bill.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
