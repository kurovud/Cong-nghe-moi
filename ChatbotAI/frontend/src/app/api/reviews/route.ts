import { NextResponse } from "next/server";
import { getReviewsByProduct, addReview, getAverageRating } from "@/lib/reviewStore";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "get") {
      const reviews = getReviewsByProduct(body.productId);
      const rating = getAverageRating(body.productId);
      return NextResponse.json({ reviews, rating });
    }

    if (action === "add") {
      const review = addReview({
        productId: body.productId,
        userId: body.userId ?? "guest",
        userName: body.userName ?? "Khách hàng",
        rating: body.rating,
        title: body.title,
        content: body.content,
        pros: body.pros,
        cons: body.cons,
        verified: body.verified ?? false,
      });
      return NextResponse.json(review);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
