"use client";

import { InvoiceForm } from "@/components/invoices/invoice-form";

export default function CreateInvoicePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight mb-4">Nueva Factura</h2>
      <InvoiceForm />
    </div>
  );
}
