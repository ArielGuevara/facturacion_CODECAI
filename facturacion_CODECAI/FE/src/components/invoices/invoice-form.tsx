"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash, Plus, Printer } from "lucide-react";
import { useState, useEffect } from "react";
import { generateInvoicePDF } from "@/lib/utils/pdfGenerator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveInvoice, generateInvoiceId } from "@/lib/services/invoiceService";
import { Invoice } from "@/types/invoice";

// --- Burnt Products ---
const PRODUCTS = [
  { id: 1, name: "Laptop Dell", price: 800, vat: true },
  { id: 2, name: "Mouse Logitech", price: 25, vat: true },
  { id: 3, name: "Teclado Mecánico", price: 60, vat: true },
  { id: 4, name: "Servicio Instalación", price: 30, vat: false }, // 0% vat
  { id: 5, name: "Licencia Windows", price: 150, vat: true },
];

interface InvoiceItemForm {
  productId: string;
  quantity: number;
  price: number; // derived
  name: string; // derived
  vat: boolean; // derived
}

interface InvoiceFormValues {
  customerName: string;
  customerRuc: string;
  customerAddress: string;
  date: string;
  items: InvoiceItemForm[];
}

export function InvoiceForm() {
  const router = useRouter();
  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<InvoiceFormValues>({
    defaultValues: {
      customerName: "",
      customerRuc: "",
      customerAddress: "",
      date: new Date().toISOString().split("T")[0],
      items: [{ productId: "", quantity: 1, price: 0, name: "", vat: false }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Calculations
  const items = useWatch({
    control,
    name: "items",
  }) || [];

  const [totals, setTotals] = useState({ sub0: 0, sub15: 0, iva: 0, total: 0 });

  useEffect(() => {
    let sub0 = 0;
    let sub15 = 0;

    items.forEach(item => {
      // Ensure values are numbers
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      const lineTotal = price * quantity;
      
      if (item.vat) {
        sub15 += lineTotal;
      } else {
        sub0 += lineTotal;
      }
    });

    const iva = sub15 * 0.15;
    const total = sub0 + sub15 + iva;

    setTotals({ sub0, sub15, iva, total });
  }, [items]);

  const handleProductChange = (index: number, productId: string) => {
    const product = PRODUCTS.find(p => p.id.toString() === productId);
    if (product) {
      setValue(`items.${index}.price`, product.price, { shouldValidate: true, shouldDirty: true });
      setValue(`items.${index}.name`, product.name, { shouldValidate: true, shouldDirty: true });
      setValue(`items.${index}.vat`, product.vat, { shouldValidate: true, shouldDirty: true });
    }
  };

  const onSubmit = (data: InvoiceFormValues) => {
    const invoiceId = generateInvoiceId();
    
    const newInvoice: Invoice = {
      id: invoiceId,
      customerName: data.customerName,
      customerRuc: data.customerRuc,
      customerAddress: data.customerAddress,
      date: data.date,
      items: data.items.map(item => ({
        id: parseInt(item.productId),
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price),
        total: Number(item.quantity) * Number(item.price)
      })),
      subtotal0: totals.sub0,
      subtotal12: totals.sub15, // SRI 15%
      iva: totals.iva,
      total: totals.total,
      status: "Pagada", // Default to paid for now
    };

    try {
      saveInvoice(newInvoice); // Persist
      generateInvoicePDF(newInvoice); // Download
      toast.success("Factura generada y guardada correctamente");
      setTimeout(() => router.push("/pages/dashboard/invoices"), 1500);
    } catch (e) {
      console.error(e);
      toast.error("Error al generar PDF o guardar");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Area */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Datos de Factura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Razón Social / Cliente</Label>
                <Input {...register("customerName", { required: true })} placeholder="Nombre del cliente" />
                {errors.customerName && <span className="text-red-500 text-xs">Requerido</span>}
              </div>
              <div className="space-y-2">
                <Label>RUC / CI</Label>
                <Input {...register("customerRuc", { required: true })} placeholder="1712345678001" />
                {errors.customerRuc && <span className="text-red-500 text-xs">Requerido</span>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input {...register("customerAddress", { required: true })} placeholder="Dirección completa" />
            </div>
            <div className="space-y-2">
              <Label>Fecha Emisión</Label>
              <Input type="date" {...register("date", { required: true })} />
            </div>
          </CardContent>
        </Card>

        <Card>
           <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Detalle</CardTitle>
            <Button size="sm" onClick={() => append({ productId: "", quantity: 1, price: 0, name: "", vat: false })}>
                <Plus className="h-4 w-4 mr-2" /> Agregar Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-12 md:col-span-5">
                   <Label className="md:hidden">Producto</Label>
                    <Select onValueChange={(val) => {
                        setValue(`items.${index}.productId`, val);
                        handleProductChange(index, val);
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar producto" />
                        </SelectTrigger>
                        <SelectContent>
                            {PRODUCTS.map(p => (
                                <SelectItem key={p.id} value={p.id.toString()}>
                                    {p.name} - ${p.price}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="col-span-4 md:col-span-2">
                     <Label className="md:hidden">Cant</Label>
                    <Input type="number" min="1" {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                </div>
                <div className="col-span-4 md:col-span-2">
                     <Label className="md:hidden">Precio</Label>
                    <Input readOnly {...register(`items.${index}.price`)} />
                </div>
                 <div className="col-span-3 md:col-span-2 flex items-center h-10">
                     <span className="text-sm text-muted-foreground mr-1">$</span>
                     <span>{(watch(`items.${index}.price`) * watch(`items.${index}.quantity`)).toFixed(2)}</span>
                </div>
                <div className="col-span-1 md:col-span-1">
                  <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Totals Area */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal 0%</span>
                <span>${totals.sub0.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal 15%</span>
                <span>${totals.sub15.toFixed(2)}</span>
            </div>
             <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (15%)</span>
                <span>${totals.iva.toFixed(2)}</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>TOTAL</span>
                <span>${totals.total.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={handleSubmit(onSubmit)}>
                <Printer className="mr-2 h-4 w-4" /> Generar Factura
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
