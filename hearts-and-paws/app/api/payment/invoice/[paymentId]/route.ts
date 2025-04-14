// app/api/payments/invoice/pdf/[paymentId]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  // Resolve dynamic parameters.
  const { paymentId } = await Promise.resolve(params);

  try {
    // Fetch the Payment record along with related service and customer data.
    const paymentRecord = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        service: true,
        customer: true,
      },
    });

    if (!paymentRecord) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // If a PDF invoice is already saved, return it.
    if (paymentRecord.invoicePdf) {
      const pdfBuffer = Buffer.from(paymentRecord.invoicePdf, "base64");
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="invoice-${paymentRecord.id}.pdf"`,
        },
      });
    }

    // Build invoice data from the payment record.
    const invoice = {
      invoiceId: `INV-${paymentRecord.id.substring(0, 8).toUpperCase()}`,
      invoiceDate: new Date().toLocaleDateString(),
      paymentId: paymentRecord.id,
      serviceName: paymentRecord.service?.name || "N/A",
      serviceDescription: paymentRecord.service?.description || "N/A",
      amount: paymentRecord.amount,
      currency: paymentRecord.currency,
      status: paymentRecord.status,
      method: paymentRecord.method || "N/A",
      customerName: paymentRecord.customer
        ? `${paymentRecord.customer.firstName || ""} ${paymentRecord.customer.lastName || ""}`.trim()
        : "N/A",
      customerEmail: paymentRecord.customer?.email || "N/A",
    };

    // Create a new PDF Document using pdf-lib.
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    const titleFontSize = 20;

    // Embed a standard font. (StandardFonts.Helvetica is available without extra files.)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let yPos = height - 50;
    // Add title.
    page.drawText("Invoice", {
      x: 50,
      y: yPos,
      size: titleFontSize,
      font,
      color: rgb(0, 0, 0),
    });
    yPos -= 30;
    // Invoice details.
    page.drawText(`Invoice ID: ${invoice.invoiceId}`, { x: 50, y: yPos, size: fontSize, font });
    yPos -= 20;
    page.drawText(`Invoice Date: ${invoice.invoiceDate}`, { x: 50, y: yPos, size: fontSize, font });
    yPos -= 20;
    page.drawText(`Payment ID: ${invoice.paymentId}`, { x: 50, y: yPos, size: fontSize, font });
    yPos -= 30;
    // Service information.
    page.drawText("--- Service Information ---", { x: 50, y: yPos, size: fontSize, font });
    yPos -= 20;
    page.drawText(`Service Name: ${invoice.serviceName}`, { x: 50, y: yPos, size: fontSize, font });
    yPos -= 20;
    page.drawText(`Service Description: ${invoice.serviceDescription}`, { x: 50, y: yPos, size: fontSize, font });
    yPos -= 30;
    // Payment details.
    page.drawText("--- Payment Details ---", { x: 50, y: yPos, size: fontSize, font });
    yPos -= 20;
    page.drawText(`Amount: ${invoice.currency.toUpperCase()} ${invoice.amount}`, { x: 50, y: yPos, size: fontSize, font });
    yPos -= 20;
    page.drawText(`Status: ${invoice.status}`, { x: 50, y: yPos, size: fontSize, font });
    yPos -= 20;
    page.drawText(`Method: ${invoice.method}`, { x: 50, y: yPos, size: fontSize, font });
    yPos -= 30;
    // Customer details.
    page.drawText("--- Customer Information ---", { x: 50, y: yPos, size: fontSize, font });
    yPos -= 20;
    page.drawText(`Customer Name: ${invoice.customerName}`, { x: 50, y: yPos, size: fontSize, font });
    yPos -= 20;
    page.drawText(`Customer Email: ${invoice.customerEmail}`, { x: 50, y: yPos, size: fontSize, font });

    // Save the PDF document as bytes.
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);
    const pdfBase64 = pdfBuffer.toString("base64");

    // Save the generated PDF (Base64) in the Payment record.
    await prisma.payment.update({
      where: { id: paymentId },
      data: { invoicePdf: pdfBase64 },
    });

    // Return the PDF with proper headers.
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="invoice-${paymentRecord.id}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Invoice Generation Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
