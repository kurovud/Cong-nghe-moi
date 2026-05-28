import { NextResponse } from 'next/server';
import { serverFetch } from '@/services/http';

// Very small webhook emulator: accepts { paymentId }
// In production this should verify signatures from payment providers.

// Import dynamic to avoid circular issues; will call invoices endpoint via fetch

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paymentId, orderId, method, to } = body;
    if (!paymentId) return NextResponse.json({ error: 'missing paymentId' }, { status: 400 });

    let paymentSynced = false;
    if (orderId && method) {
      const normalizedMethod = String(method).toLowerCase();
      if (normalizedMethod === 'momo') {
        await serverFetch('/api/payments/momo-webhook', {
          method: 'POST',
          body: JSON.stringify({ orderId, resultCode: 0, amount: body.amount }),
        });
        paymentSynced = true;
      } else if (normalizedMethod === 'zalopay' || normalizedMethod === 'vnpay') {
        await serverFetch('/api/payments/vnpay-webhook', {
          method: 'POST',
          body: JSON.stringify({ vnp_TxnRef: orderId, vnp_ResponseCode: '00' }),
        });
        paymentSynced = true;
      }
    }

    // Invoice/email is best-effort and must not fail payment confirmation.
    let invoiceResult: any = null;
    let invoiceWarning: string | null = null;
    try {
      const origin = new URL(req.url).origin;
      const url = `${origin}/api/invoices/create`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ paymentId, to }),
      });

      invoiceResult = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        invoiceWarning = (invoiceResult as any)?.error || `invoice_failed_${resp.status}`;
      }
    } catch (error: any) {
      invoiceWarning = error?.message || String(error);
    }

    return NextResponse.json({ ok: true, paymentSynced, invoiceResult, invoiceWarning });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
