"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/types/product.type";
import { useAuth } from "@/components/providers/AuthProvider";
import type { ProductReview } from "@/types/order.type";
import { productApi } from "@/services/paper.api";
import { reviewApi } from "@/services/review.api";
import { cartApi, wishlistApi } from "@/services/conference.api";
import { resolveProductImage } from "@/lib/product-image";

const CATEGORY_LABELS: Record<string, string> = {
  cpu: "CPU - Vi xử lý",
  gpu: "GPU - Card đồ họa",
  mainboard: "Mainboard - Bo mạch chủ",
  ram: "RAM",
  ssd: "SSD - Ổ cứng thể rắn",
  hdd: "HDD - Ổ cứng cơ",
  psu: "PSU - Nguồn máy tính",
  case: "Case - Vỏ máy tính",
  cooler: "Tản nhiệt",
  monitor: "Màn hình",
  keyboard: "Bàn phím",
  mouse: "Chuột",
  headset: "Tai nghe",
  laptop: "Laptop",
  prebuilt: "PC nguyên bộ",
};

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + "₫";

export default function ProductDetailPage() {
  const params = useParams();
  const category = params.category as string;
  const id = params.id as string;
  const { user, cart, refreshCart, refreshWishlist } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [addingCart, setAddingCart] = useState(false);
  const [cartMsg, setCartMsg] = useState("");
  const [inWishlist, setInWishlist] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const categoryLabel = CATEGORY_LABELS[category] ?? category;

  useEffect(() => {
    setLoading(true);
    productApi.getProductById(id)
      .then(async (data) => {
        const current = data?.data;
        if (!current) throw new Error("Not found");
        setProduct(current);

        const rel = await productApi.getProducts({ category: current.category, limit: 8 });
        const relItems = (rel?.data ?? []).filter((p: any) => p.id !== current.id).slice(0, 4);
        setRelated(relItems);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });

    Promise.all([reviewApi.getProductReviews(id), reviewApi.getProductStats(id)])
      .then(([reviewRes, statRes]) => {
        setReviews(reviewRes?.data?.reviews ?? []);
        setAvgRating(Number(statRes?.data?.averageRating || 0));
      })
      .catch(() => {});
  }, [id]);

  // check wishlist status
  useEffect(() => {
    if (!user) return;
    wishlistApi.getWishlist()
      .then((d) => {
        const items = d?.data ?? [];
        setInWishlist(items.some((w: any) => w.productId === id));
      }).catch(() => {});
  }, [user, id]);

  const handleAddToCart = async () => {
    if (!user) { window.location.href = "/login"; return; }
    setAddingCart(true);
    try {
      if (!product) throw new Error("Sản phẩm không tồn tại");
      const nextItems = [...cart.items];
      const existing = nextItems.find((item) => item.productId === id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + qty, existing.maxStock || product.stock);
      } else {
        nextItems.push({
          productId: product.id,
          name: product.name,
          category: product.category,
          brand: product.brand,
          price: product.price,
          discountPrice: product.discountPrice,
          image: product.image,
          quantity: qty,
          maxStock: product.stock,
        });
      }
      await cartApi.updateItems(nextItems as any[]);
      setCartMsg("✅ Đã thêm vào giỏ hàng!");
      refreshCart();
      setTimeout(() => setCartMsg(""), 3000);
    } catch { setCartMsg("❌ Lỗi, thử lại"); }
    setAddingCart(false);
  };

  const toggleWishlist = async () => {
    if (!user) { window.location.href = "/login"; return; }
    if (inWishlist) {
      await wishlistApi.removeItem(id);
    } else {
      await wishlistApi.addItem(id);
    }
    setInWishlist(!inWishlist);
    refreshWishlist();
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      await reviewApi.createReview({
        productId: id,
        rating: reviewRating,
        title: `Đánh giá ${reviewRating} sao`,
        content: reviewComment,
      });
      const [reviewRes, statRes] = await Promise.all([
        reviewApi.getProductReviews(id),
        reviewApi.getProductStats(id),
      ]);
      setReviews(reviewRes?.data?.reviews ?? []);
      setAvgRating(Number(statRes?.data?.averageRating || 0));
      setReviewComment("");
      setReviewRating(5);
    } catch {}
    setSubmittingReview(false);
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="products-loading">
            <div className="spinner" />
            <p>Đang tải thông tin sản phẩm…</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="products-empty">
            <h2>Không tìm thấy sản phẩm</h2>
            <p>Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
            <Link href={`/products/${category}`} className="button btn-sm">
              ← Quay lại {categoryLabel}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  return (
    <div className="products-page">
      {/* Breadcrumb */}
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="breadcrumb__sep">/</span>
          <Link href="/products">Sản phẩm</Link>
          <span className="breadcrumb__sep">/</span>
          <Link href={`/products/${category}`}>{categoryLabel}</Link>
          <span className="breadcrumb__sep">/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      <section className="section">
        <div className="container">
          {/* Product detail layout */}
          <div className="product-detail">
            {/* Image */}
            <div className="product-detail__image">
              <img
                src={resolveProductImage(product.image, product.category)}
                alt={product.name}
                onError={(event) => {
                  event.currentTarget.src = resolveProductImage(null);
                }}
              />
              {discount > 0 && (
                <span className="product-card__badge">-{discount}%</span>
              )}
            </div>

            {/* Info */}
            <div className="product-detail__info">
              <span className="product-detail__brand">{product.brand}</span>
              <h1 className="product-detail__name">{product.name}</h1>

              <div className="product-detail__rating">
                {"⭐".repeat(Math.round(product.rating))}
                <span>{product.rating}/5</span>
              </div>

              <p className="product-detail__desc">{product.shortDesc}</p>

              <div className="product-detail__pricing">
                {product.discountPrice ? (
                  <>
                    <span className="product-detail__price product-detail__price--sale">
                      {formatVND(product.discountPrice)}
                    </span>
                    <span className="product-detail__price product-detail__price--old">
                      {formatVND(product.price)}
                    </span>
                    <span className="product-detail__discount">
                      Tiết kiệm {formatVND(product.price - product.discountPrice)}
                    </span>
                  </>
                ) : (
                  <span className="product-detail__price">
                    {formatVND(product.price)}
                  </span>
                )}
              </div>

              <div className="product-detail__stock">
                {product.stock > 0 ? (
                  <span className="stock--in">✅ Còn hàng ({product.stock} sản phẩm)</span>
                ) : (
                  <span className="stock--out">❌ Hết hàng</span>
                )}
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="product-detail__tags">
                  {product.tags.map((tag) => (
                    <span key={tag} className="product-detail__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="product-detail__actions">
                {product.stock > 0 && (
                  <div className="product-detail__cart-row">
                    <div className="product-detail__qty">
                      <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                      <span>{qty}</span>
                      <button type="button" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                    </div>
                    <button type="button" className="button hero__btn-primary" onClick={handleAddToCart} disabled={addingCart}>
                      {addingCart ? "Đang thêm…" : "Thêm vào giỏ hàng"}
                    </button>
                  </div>
                )}
                {cartMsg && <p className="product-detail__cart-msg">{cartMsg}</p>}
                <div className="product-detail__sub-actions">
                  <button type="button" className={`btn-wishlist ${inWishlist ? "btn-wishlist--active" : ""}`} onClick={toggleWishlist}>
                    {inWishlist ? "Đã yêu thích" : "Yêu thích"}
                  </button>
                  <Link
                    href={`/chat?product=${encodeURIComponent(product.id)}&name=${encodeURIComponent(product.name)}&category=${encodeURIComponent(product.category)}`}
                    className="button hero__btn-secondary"
                  >
                    Hỏi AI về sản phẩm này
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Specs table */}
          <div className="product-specs">
            <h2>Thông số kỹ thuật</h2>
            <table className="specs-table">
              <tbody>
                {Object.entries(product.specs).map(([key, value]) => (
                  <tr key={key}>
                    <td className="specs-table__key">{key}</td>
                    <td className="specs-table__value">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Compatibility key */}
          {product.compatKey && (
            <div className="product-compat">
              <h3>Thông tin tương thích</h3>
              <p>
                <strong>Socket / Chipset:</strong> {product.compatKey}
              </p>
              <p>
                Sử dụng chatbot AI để kiểm tra tương thích với các linh kiện
                khác:{" "}
                <Link href="/chat" className="link">
                  Chat ngay →
                </Link>
              </p>
            </div>
          )}

          {/* Related products */}
          {related.length > 0 && (
            <div className="product-related">
              <h2>Sản phẩm liên quan</h2>
              <div className="grid grid-4">
                {related.map((rp) => (
                  <Link
                    href={`/products/${rp.category}/${rp.id}`}
                    key={rp.id}
                    className="product-card product-card--sm"
                  >
                    <div className="product-card__image">
                      <img
                        src={resolveProductImage(rp.image, rp.category)}
                        alt={rp.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = resolveProductImage(null);
                        }}
                      />
                    </div>
                    <div className="product-card__body">
                      <span className="product-card__brand">{rp.brand}</span>
                      <h3 className="product-card__name">{rp.name}</h3>
                      <div className="product-card__pricing">
                        <span className="product-card__price">
                          {formatVND(rp.discountPrice ?? rp.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="product-reviews-section">
            <h2>Đánh giá sản phẩm ({reviews.length} đánh giá{avgRating > 0 ? ` — ${avgRating.toFixed(1)}/5` : ""})</h2>

            {/* Add Review Form */}
            {user ? (
              <form className="review-form" onSubmit={handleSubmitReview}>
                <div className="review-form__rating">
                  <label>Đánh giá:</label>
                  <div className="review-stars-input">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" className={`review-star ${s <= reviewRating ? "review-star--active" : ""}`} onClick={() => setReviewRating(s)}>★</button>
                    ))}
                  </div>
                </div>
                <textarea className="review-form__text" value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này…" rows={3} required />
                <button className="button btn-sm" type="submit" disabled={submittingReview}>{submittingReview ? "Đang gửi…" : "Gửi đánh giá"}</button>
              </form>
            ) : (
              <p className="review-login-prompt"><Link href="/login">Đăng nhập</Link> để viết đánh giá.</p>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-muted">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
            ) : (
              <div className="reviews-list">
                {reviews.map(rv => (
                  <div key={rv.id} className="review-item">
                    <div className="review-item__header">
                      <strong>{rv.userName}</strong>
                      <span className="review-item__stars">{"⭐".repeat(rv.rating)}</span>
                      <span className="review-item__date">{new Date(rv.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <p className="review-item__comment">{rv.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
