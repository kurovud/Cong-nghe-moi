import { NextResponse } from 'next/server';
import { respondToMessage } from '@/services/chatbot/chatbot';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userId } = body;
    if (!message) return NextResponse.json({ error: 'missing message' }, { status: 400 });
    const reply = await respondToMessage({ message, userId });
    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
