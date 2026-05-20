import { NextResponse } from "next/server";
import { serverFetch } from "@/services/http";
import { normalizeProductImage, normalizeProductImageList } from "@/lib/product-image";

export const GET = async (
  _request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const productRes = await serverFetch<any>(`/api/products/${params.id}`);
    const product = productRes?.data ? normalizeProductImage(productRes.data) : null;

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    const relatedRes = await serverFetch<any>("/api/products", {
      params: { category: product.category, limit: 8 },
    });
    const related = normalizeProductImageList(relatedRes?.data ?? [])
      .filter((p: any) => p.id !== product.id)
      .slice(0, 4);

    return NextResponse.json({ product, related });
  } catch {
    return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
  }
};
