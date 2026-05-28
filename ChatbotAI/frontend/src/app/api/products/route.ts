import { NextResponse } from "next/server";
import { serverFetch } from "@/services/http";
import { normalizeProductImageList } from "@/lib/product-image";
import seedProducts from "@/../../scripts/seed-data/products.json";

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreProduct(product: any, query: string) {
  const haystack = normalizeText([
    product.name,
    product.shortDesc,
    product.brand,
    product.category,
    JSON.stringify(product.specs ?? {}),
  ].filter(Boolean).join(" "));
  const normalizedQuery = normalizeText(query);
  const terms = normalizedQuery.split(" ").filter(Boolean);
  if (!terms.length) return 0;

  let score = 0;
  for (const term of terms) {
    if (haystack.includes(term)) score += 1;
  }
  if (haystack.includes(normalizedQuery)) score += 2;
  return score;
}

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (value) params[key] = value;
  });

  try {
    if (params.q) {
      const limit = Number(params.limit || 20);
      const list = normalizeProductImageList(
        (seedProducts as any[])
          .map((product) => ({ ...product, score: scoreProduct(product, params.q) }))
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score || Number(b.rating ?? 0) - Number(a.rating ?? 0) || Number(b.stock ?? 0) - Number(a.stock ?? 0))
          .slice(0, Number.isFinite(limit) && limit > 0 ? limit : 20)
      );
      return NextResponse.json({ products: list, total: list.length });
    }

    const data = await serverFetch<any>("/api/products", { params });
    const products = normalizeProductImageList(data?.data ?? []);
    return NextResponse.json({
      products,
      total: data?.pagination?.total ?? 0,
      pagination: data?.pagination,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Cannot fetch products" }, { status: 500 });
  }
};
