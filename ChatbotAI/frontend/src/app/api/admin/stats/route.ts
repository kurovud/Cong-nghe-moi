import { NextResponse } from "next/server";
import { getStoreStats } from "@/lib/productStore";
import { listKnowledge } from "@/lib/knowledgeStore";

export const GET = async () => {
  const stats = getStoreStats();
  const knowledge = listKnowledge();

  return NextResponse.json({
    ...stats,
    totalKnowledge: knowledge.length
  });
};
