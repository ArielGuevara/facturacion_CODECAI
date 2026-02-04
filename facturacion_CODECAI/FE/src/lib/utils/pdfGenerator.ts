import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Invoice } from "@/types/invoice";

export const generateInvoicePDF = (data: Invoice) => {
    const doc = new jsPDF();


    // Header
    doc.setFontSize(22);
    doc.text("FACTURA ELECTRÓNICA", 14, 22);

    doc.setFontSize(10);
    doc.text("RUC: 1723456789001", 14, 30);
    doc.text("EMPRESA: FACTURACIÓN CODECAI S.A.", 14, 35);
    doc.text("Dirección: Av. Amazonas y Naciones Unidas", 14, 40);

    // Customer Info
    doc.setFontSize(12);
    doc.text("Datos del Cliente", 14, 55);

    doc.setFontSize(10);
    doc.text(`Razón Social: ${data.customerName}`, 14, 62);
    doc.text(`RUC/CI: ${data.customerRuc}`, 14, 67);
    doc.text(`Dirección: ${data.customerAddress}`, 14, 72);
    doc.text(`Fecha Emisión: ${data.date}`, 14, 77);

    // Table
    const tableColumn = ["Cant", "Descripción", "P. Unitario", "Total"];
    const tableRows: any[] = [];

    data.items.forEach((item) => {
        const invoiceData = [
            item.quantity,
            item.name,
            `$${item.price.toFixed(2)}`,
            `$${item.total.toFixed(2)}`,
        ];
        tableRows.push(invoiceData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 85,
    });

    // Footer / Totals
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY || 150;

    doc.text(`Subtotal 0%:     $${data.subtotal0.toFixed(2)}`, 140, finalY + 10);
    doc.text(`Subtotal 15%:    $${data.subtotal12.toFixed(2)}`, 140, finalY + 15);
    doc.text(`IVA 15%:         $${data.iva.toFixed(2)}`, 140, finalY + 20);
    doc.setFontSize(12);
    doc.text(`TOTAL:           $${data.total.toFixed(2)}`, 140, finalY + 30);

    doc.save(`Factura_${data.customerName}_${data.date}.pdf`);
};
