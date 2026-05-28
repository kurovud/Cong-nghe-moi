import { NextResponse } from 'next/server';
import { createInvoiceHtml } from '@/lib/invoice';
import { sendEmail } from '@/lib/email';
import { htmlToPdfBuffer } from '@/lib/pdf';

type InvoiceRecord = {
  id: string;
  paymentId?: string;
  to?: string;
  html: string;
  createdAt: string;
};

const invoices: InvoiceRecord[] = [];

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function makeInvoiceNumber() {
  const nextIndex = invoices.length + 1;
  return `HD${String(nextIndex).padStart(4, '0')}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paymentId, to = '' } = body;
    const id = makeInvoiceNumber();
    // In real app, load payment/order details from DB. Here we create placeholder invoice.
    const html = createInvoiceHtml({ id, paymentId, to, items: [], total: 0 });

    const inv: InvoiceRecord = { id, paymentId, to, html, createdAt: new Date().toISOString() };
    invoices.push(inv);

    // Send email if address provided
    if (to) {
      // Generate PDF buffer and attach
      try {
        const pdf = await htmlToPdfBuffer(html);
        await sendEmail({ to, subject: `Hoá đơn #${id}`, html, attachments: [{ filename: `invoice-${id}.pdf`, content: pdf }, { filename: `invoice-${id}.html`, content: html }] });
      } catch (e) {
        // fallback to HTML attachment
        await sendEmail({ to, subject: `Hoá đơn #${id}`, html, attachments: [{ filename: `invoice-${id}.html`, content: html }] });
      }
    }

    return NextResponse.json({ invoice: { id, paymentId, to }, sent: Boolean(to) });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ invoices });
}
