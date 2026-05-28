import { NextResponse } from 'next/server';

type PaymentRecord = {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
};

// Simple in-memory store (for dev). Replace with DB in production.
const payments = new Map<string, PaymentRecord>();

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = 'VND', method = 'vnpay' } = body;
    const id = makeId();
    const rec: PaymentRecord = {
      id,
      amount: Number(amount) || 0,
      currency,
      method,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    payments.set(id, rec);

    // Generate a QR code URL using public QR API (no dependency)
    const payload = encodeURIComponent(JSON.stringify({ paymentId: id, amount: rec.amount, method: rec.method }));
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${payload}`;

    return NextResponse.json({ payment: rec, qrUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

export async function GET() {
  // Return current pending payments (dev convenience)
  return NextResponse.json({ payments: Array.from(payments.values()) });
}
