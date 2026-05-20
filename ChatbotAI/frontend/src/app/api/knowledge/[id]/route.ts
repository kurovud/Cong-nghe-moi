import { NextResponse } from "next/server";
import { removeKnowledge } from "@/lib/knowledgeStore";

export const DELETE = async (
  _request: Request,
  { params }: { params: { id: string } }
) => {
  const next = removeKnowledge(params.id);
  return NextResponse.json({ items: next });
};
