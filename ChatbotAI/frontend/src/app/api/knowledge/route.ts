import { NextResponse } from "next/server";
import { addKnowledge, listKnowledge } from "@/lib/knowledgeStore";
import { KnowledgeItem } from "@/types/knowledge";

export const GET = async () => {
  return NextResponse.json({ items: listKnowledge() });
};

export const POST = async (request: Request) => {
  const payload = (await request.json()) as KnowledgeItem | KnowledgeItem[];
  const items = Array.isArray(payload) ? payload : [payload];

  const normalized = items.map((item) => ({
    ...item,
    id: item.id || crypto.randomUUID(),
    createdAt: item.createdAt || new Date().toISOString(),
    tags: item.tags ?? []
  }));

  const next = addKnowledge(normalized);
  return NextResponse.json({ items: next });
};
