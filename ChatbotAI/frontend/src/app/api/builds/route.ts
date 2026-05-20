import { NextResponse } from "next/server";
import { getAllPrebuiltPCs, getPrebuiltByBudget, getPrebuiltByPurpose } from "@/lib/productStore";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const budget = searchParams.get("budget");
  const purpose = searchParams.get("purpose");

  let builds;

  if (budget && purpose) {
    builds = getPrebuiltByBudget(parseInt(budget, 10)).filter(
      (b) => b.purpose.toLowerCase().includes(purpose.toLowerCase())
    );
  } else if (budget) {
    builds = getPrebuiltByBudget(parseInt(budget, 10));
  } else if (purpose) {
    builds = getPrebuiltByPurpose(purpose);
  } else {
    builds = getAllPrebuiltPCs();
  }

  return NextResponse.json({ builds, total: builds.length });
};
