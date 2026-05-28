import { NextResponse } from 'next/server';
import products from '@/../../scripts/seed-data/products.json';
import { respondToMessage } from '@/services/chatbot/chatbot';

// Simple RAG-like endpoint: keyword matching over product catalogue.
export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    if (!question) return NextResponse.json({ error: 'missing question' }, { status: 400 });
    const answer = await respondToMessage({ message: String(question) });
    const q = String(question).toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    const matches = (products as any[]).map(p => {
      const hay = `${p.name} ${p.shortDesc} ${JSON.stringify(p.specs)}`.toLowerCase();
      const score = tokens.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
      return { product: p, score };
    }).filter(s => s.score > 0).sort((a,b) => b.score - a.score).slice(0,5).map(s => s.product);

    return NextResponse.json({ answer, matches });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
