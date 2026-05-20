import { NextResponse } from "next/server";
import { serverFetch } from "@/services/http";
import { normalizeProductImageList } from "@/lib/product-image";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (value) params[key] = value;
  });

  try {
    if (params.q) {
      const searchData = await serverFetch<any>("/api/products/search", { params: { q: params.q } });
      const list = normalizeProductImageList(searchData?.data ?? []);
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
