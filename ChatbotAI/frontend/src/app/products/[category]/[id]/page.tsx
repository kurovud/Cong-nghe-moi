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

const CATEGORY_EMOJI: Record<string, string> = {
  cpu: "💻", gpu: "🎮", mainboard: "⚡", ram: "🧠", ssd: "💾",
  hdd: "📀", psu: "⚙️", case: "🖥️", cooler: "🌡️", monitor: "🖥️",
  keyboard: "⌨️", mouse: "🖱️", headset: "🎧", laptop: "💻", prebuilt: "🧩",
};

const CATEGORY_GRADIENT: Record<string, string> = {
  cpu: "linear-gradient(135deg, rgba(0,212,255,0.12) 0%, rgba(168,85,247,0.08) 100%)",
  gpu: "linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(249,115,22,0.08) 100%)",
  mainboard: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(0,212,255,0.08) 100%)",
  ram: "linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(168,85,247,0.08) 100%)",
  ssd: "linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(16,185,129,0.06) 100%)",
  monitor: "linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(0,212,255,0.08) 100%)",
  laptop: "linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(168,85,247,0.08) 100%)",
};

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "₫";

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
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [activeThumb, setActiveThumb] = useState(0);

  const categoryLabel = CATEGORY_LABELS[category] ?? category;
  const categoryEmoji = CATEGORY_EMOJI[category] ?? "📦";
  const categoryGradient = CATEGORY_GRADIENT[category] ?? "linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(168,85,247,0.06) 100%)";

  // ─── Data Fetching ────────────────────────────────────────────────────────
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
      .catch(() => { setNotFound(true); setLoading(false); });

    Promise.all([reviewApi.getProductReviews(id), reviewApi.getProductStats(id)])
      .then(([reviewRes, statRes]) => {
        setReviews(reviewRes?.data?.reviews ?? []);
        setAvgRating(Number(statRes?.data?.averageRating || 0));
      })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!user) return;
    wishlistApi.getWishlist()
      .then((d) => {
        const items = d?.data ?? [];
        setInWishlist(items.some((w: any) => w.productId === id));
      }).catch(() => {});
  }, [user, id]);

  // ─── Handlers ────────────────────────────────────────────────────────────
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
          productId: product.id, name: product.name, category: product.category,
          brand: product.brand, price: product.price, discountPrice: product.discountPrice,
          image: product.image, quantity: qty, maxStock: product.stock,
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
    if (inWishlist) { await wishlistApi.removeItem(id); } else { await wishlistApi.addItem(id); }
    setInWishlist(!inWishlist);
    refreshWishlist();
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      await reviewApi.createReview({ productId: id, rating: reviewRating, title: `Đánh giá ${reviewRating} sao`, content: reviewComment });
      const [reviewRes, statRes] = await Promise.all([reviewApi.getProductReviews(id), reviewApi.getProductStats(id)]);
      setReviews(reviewRes?.data?.reviews ?? []);
      setAvgRating(Number(statRes?.data?.averageRating || 0));
      setReviewComment("");
      setReviewRating(5);
    } catch {}
    setSubmittingReview(false);
  };

  // ─── Loading State ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" />
          <p style={{ color: 'var(--text-2)', marginTop: '1rem', fontFamily: 'var(--font)' }}>Đang tải thông tin sản phẩm…</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          textAlign: 'center', background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)', borderRadius: 'var(--r-xl)',
          padding: '3rem', backdropFilter: 'blur(20px)', maxWidth: 480,
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Không tìm thấy sản phẩm</h2>
          <p style={{ color: 'var(--text-3)', marginBottom: '1.5rem', lineHeight: 1.6 }}>Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
          <Link href={`/products/${category}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--grad-brand)', color: '#fff', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
            ← Quay lại {categoryLabel}
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const tabs = [
    { key: "desc" as const, label: "Mô tả", icon: "📝" },
    { key: "specs" as const, label: "Thông số kỹ thuật", icon: "⚙️" },
    { key: "reviews" as const, label: `Đánh giá (${reviews.length})`, icon: "⭐" },
  ];

  // Mock thumbnails
  const thumbs = [categoryEmoji, "📷", "🔍", "📐"];

  // Rating bar counts (mock)
  const ratingCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => Math.round(r.rating) === s).length,
  }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ── Breadcrumb ── */}
      <div className="container" style={{ paddingTop: '1.5rem' }}>
        <nav style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
          fontSize: '0.82rem', padding: '0.6rem 1.25rem',
          background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
          borderRadius: '999px', backdropFilter: 'blur(16px)',
        }}>
          <Link href="/" style={{ color: 'var(--text-3)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-3)'}
          >🏠 Trang chủ</Link>
          <span style={{ color: 'var(--border-2)' }}>›</span>
          <Link href="/products" style={{ color: 'var(--text-3)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-3)'}
          >Sản phẩm</Link>
          <span style={{ color: 'var(--border-2)' }}>›</span>
          <Link href={`/products/${category}`} style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: 500 }}>{categoryLabel}</Link>
          <span style={{ color: 'var(--border-2)' }}>›</span>
          <span style={{ color: 'var(--text)', fontWeight: 600, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
        </nav>
      </div>

      {/* ── Main Content ── */}
      <section style={{ padding: '2rem 0 0' }}>
        <div className="container">
          {/* ═══════════════ 2-COL LAYOUT ═══════════════ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem', alignItems: 'start' }}>

            {/* ══ LEFT: Image Gallery ══ */}
            <div className="product-gallery">
              {/* Main Image */}
              <div
                className="product-gallery__main"
                style={{ background: categoryGradient }}
              >
                {/* Corner decoration */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: 80, height: 80, background: 'linear-gradient(135deg, rgba(0,212,255,0.08), transparent)', borderRadius: 'var(--r-xl) 0 0 0', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 80, height: 80, background: 'linear-gradient(315deg, rgba(168,85,247,0.08), transparent)', borderRadius: '0 0 var(--r-xl) 0', pointerEvents: 'none' }} />

                {/* Discount Badge */}
                {discount > 0 && (
                  <span style={{
                    position: 'absolute', top: '1rem', right: '1rem', zIndex: 2,
                    background: 'linear-gradient(135deg, #f97316, #ef4444)',
                    color: '#fff', fontWeight: 800, fontSize: '0.9rem',
                    padding: '0.4rem 0.9rem', borderRadius: '999px',
                    boxShadow: '0 4px 16px rgba(249,115,22,0.45)',
                  }}>
                    SALE -{discount}%
                  </span>
                )}

                {/* Product Image or Emoji */}
                {activeThumb === 0 ? (
                  <img
                    src={resolveProductImage(product.image, product.category)}
                    alt={product.name}
                    onError={(e) => { e.currentTarget.src = resolveProductImage(null); }}
                    style={{ maxWidth: '70%', maxHeight: '70%', objectFit: 'contain', position: 'relative', zIndex: 1, transition: 'transform 0.4s ease', filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.4))' }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                ) : (
                  <span style={{ fontSize: '5rem', filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.4))' }}>{categoryEmoji}</span>
                )}

                {/* Zoom hint */}
                <div style={{
                  position: 'absolute', bottom: '0.75rem', left: '0.75rem', zIndex: 2,
                  background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                  padding: '0.25rem 0.7rem', borderRadius: '999px',
                  fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  🔍 Zoom
                </div>
              </div>

              {/* Thumbnails */}
              <div className="product-gallery__thumbs">
                {thumbs.map((t, i) => (
                  <div
                    key={i}
                    className={`product-gallery__thumb${activeThumb === i ? ' product-gallery__thumb--active' : ''}`}
                    onClick={() => setActiveThumb(i)}
                  >
                    {i === 0 ? (
                      <img
                        src={resolveProductImage(product.image, product.category)}
                        alt=""
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
                      />
                    ) : (
                      <span style={{ fontSize: '1.4rem' }}>{t}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {[
                  { icon: '🔒', text: 'Thanh toán an toàn' },
                  { icon: '🚚', text: 'Miễn ship nội thành' },
                  { icon: '✅', text: 'Hàng chính hãng' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.35rem 0.75rem', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)', borderRadius: '999px',
                    fontSize: '0.72rem', color: 'var(--text-3)',
                  }}>
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ══ RIGHT: Product Info ══ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Pills row */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.brand && (
                  <span style={{
                    padding: '0.3rem 0.9rem', background: 'rgba(0,212,255,0.08)',
                    border: '1px solid rgba(0,212,255,0.25)', borderRadius: '999px',
                    color: 'var(--cyan)', fontSize: '0.77rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>{product.brand}</span>
                )}
                <span style={{
                  padding: '0.3rem 0.9rem', background: 'rgba(168,85,247,0.08)',
                  border: '1px solid rgba(168,85,247,0.2)', borderRadius: '999px',
                  color: 'var(--purple)', fontSize: '0.77rem', fontWeight: 600,
                }}>{categoryLabel}</span>
              </div>

              {/* Product Name */}
              <h1 style={{
                fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)',
                fontWeight: 800, color: 'var(--text)', lineHeight: 1.3, margin: 0,
              }}>
                {product.name}
              </h1>

              {/* Rating row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.1rem' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} style={{ color: s <= Math.round(product.rating ?? avgRating) ? '#fbbf24' : 'var(--border-2)', fontSize: '1rem' }}>★</span>
                  ))}
                </div>
                <span style={{ color: 'var(--text-2)', fontSize: '0.88rem', fontWeight: 600 }}>
                  {avgRating > 0 ? avgRating.toFixed(1) : (product.rating ?? 4.5).toFixed(1)}/5
                </span>
                <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>({reviews.length} đánh giá)</span>
                <span style={{ color: 'var(--border-2)' }}>·</span>
                <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>Đã bán: <strong style={{ color: 'var(--text-2)' }}>1.2K</strong></span>
              </div>

              {/* SKU */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                Mã SP: <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>#{product.id?.slice(-8)?.toUpperCase()}</span>
              </div>

              {/* ─ Price Block ─ */}
              <div style={{
                padding: '1.25rem 1.5rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                backdropFilter: 'blur(16px)',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* subtle shimmer bg */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,212,255,0.03) 0%, rgba(168,85,247,0.02) 100%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {product.discountPrice ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)',
                          background: 'linear-gradient(135deg, #00d4ff 0%, #f97316 100%)',
                          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                          {formatVND(product.discountPrice)}
                        </span>
                        <span style={{ fontSize: '1.05rem', color: 'var(--text-3)', textDecoration: 'line-through' }}>
                          {formatVND(product.price)}
                        </span>
                      </div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{
                          padding: '0.25rem 0.7rem', borderRadius: '999px',
                          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                          color: '#10b981', fontSize: '0.78rem', fontWeight: 700,
                        }}>
                          💰 Tiết kiệm {formatVND(product.price - product.discountPrice)}
                        </span>
                        <span style={{
                          padding: '0.25rem 0.7rem', borderRadius: '999px',
                          background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)',
                          color: 'var(--orange)', fontSize: '0.75rem', fontWeight: 700,
                        }}>
                          -{discount}% OFF
                        </span>
                      </div>
                    </>
                  ) : (
                    <span style={{
                      fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)',
                      background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                      {formatVND(product.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* ─ Stock Status ─ */}
              <div>
                {product.stock > 0 ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16,185,129,0.2)', animation: 'stockPulse 2s infinite', flexShrink: 0, display: 'block' }} />
                    <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.88rem' }}>Còn {product.stock} sản phẩm</span>
                  </div>
                ) : (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.2)', flexShrink: 0, display: 'block' }} />
                    <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.88rem' }}>Hết hàng</span>
                  </div>
                )}
              </div>

              {/* ─ Tags ─ */}
              {product.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {product.tags.map((tag) => (
                    <span key={tag} style={{
                      padding: '0.25rem 0.65rem', background: 'rgba(168,85,247,0.08)',
                      border: '1px solid rgba(168,85,247,0.18)', borderRadius: 'var(--r-sm)',
                      color: 'var(--purple)', fontSize: '0.75rem', fontWeight: 500,
                    }}>{tag}</span>
                  ))}
                </div>
              )}

              {/* ─ Quantity + CTA ─ */}
              {product.stock > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Quantity Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-2)', fontWeight: 500 }}>Số lượng:</label>
                    <div className="product-quantity">
                      <button type="button" className="product-quantity__btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                      <div className="product-quantity__val">{qty}</div>
                      <button type="button" className="product-quantity__btn" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Tối đa {product.stock}</span>
                  </div>

                  {/* Main CTA Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <AddToCartBtn addingCart={addingCart} onClick={handleAddToCart} />
                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                      <AIQueryBtn href={`/chat?product=${encodeURIComponent(product.id)}&name=${encodeURIComponent(product.name)}&category=${encodeURIComponent(product.category)}`} />
                      <WishlistBtn inWishlist={inWishlist} onClick={toggleWishlist} />
                    </div>
                  </div>

                  {/* Cart message */}
                  {cartMsg && (
                    <div style={{
                      padding: '0.7rem 1rem', borderRadius: 'var(--r-sm)',
                      background: cartMsg.includes('✅') ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                      border: `1px solid ${cartMsg.includes('✅') ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                      color: cartMsg.includes('✅') ? '#10b981' : '#ef4444',
                      fontSize: '0.87rem', fontWeight: 500,
                      animation: 'fadeInSlide 0.3s ease',
                    }}>
                      {cartMsg}
                    </div>
                  )}
                </div>
              )}

              {/* ─ Delivery & Warranty ─ */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.25rem' }}>
                {[
                  { icon: '🚀', title: 'Giao hàng nhanh', desc: '2H nội thành, 2-5 ngày tỉnh' },
                  { icon: '🛡️', title: 'Bảo hành', desc: '24 tháng, đổi trả 7 ngày' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} style={{
                    padding: '0.85rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                    borderRadius: 'var(--r)', transition: 'border-color 0.2s',
                  }}>
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>{title}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-3)' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════ TABS ═══════════════ */}
          <div style={{
            display: 'flex', gap: '0',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg) var(--r-lg) 0 0', borderBottom: 'none',
            overflow: 'hidden',
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1, padding: '0.95rem 1rem', border: 'none', borderBottom: 'none',
                  background: activeTab === tab.key ? 'rgba(0,212,255,0.06)' : 'transparent',
                  color: activeTab === tab.key ? 'var(--cyan)' : 'var(--text-3)',
                  fontWeight: activeTab === tab.key ? 700 : 500, fontSize: '0.88rem',
                  cursor: 'pointer', transition: 'all 0.25s', fontFamily: 'var(--font)',
                  position: 'relative', borderRight: '1px solid var(--border)',
                }}
              >
                <span style={{ marginRight: '0.3rem' }}>{tab.icon}</span>
                {tab.label}
                {activeTab === tab.key && (
                  <span style={{
                    position: 'absolute', bottom: 0, left: '15%', right: '15%', height: 2,
                    background: 'var(--grad-brand)', borderRadius: '2px 2px 0 0',
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* ─ Tab Content ─ */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
            borderTop: 'none', borderRadius: '0 0 var(--r-lg) var(--r-lg)',
            padding: '2rem', backdropFilter: 'blur(20px)', marginBottom: '3.5rem',
            minHeight: 200,
          }}>
            {/* DESCRIPTION */}
            {activeTab === "desc" && (
              <div>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.85, fontSize: '0.95rem', maxWidth: 760 }}>
                  {product.shortDesc || "Chưa có mô tả chi tiết cho sản phẩm này."}
                </p>
                {product.compatKey && (
                  <div style={{
                    marginTop: '1.75rem', padding: '1.25rem 1.5rem',
                    background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)',
                    borderRadius: 'var(--r-lg)',
                  }}>
                    <h3 style={{ color: 'var(--purple)', fontFamily: 'var(--font-heading)', fontSize: '0.95rem', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      🔗 Thông tin tương thích
                    </h3>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
                      <strong style={{ color: 'var(--text)' }}>Socket / Chipset:</strong> {product.compatKey}
                    </p>
                    <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', margin: 0 }}>
                      Dùng chatbot AI để kiểm tra tương thích:{' '}
                      <Link href="/chat" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: 600 }}>Chat ngay →</Link>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SPECS */}
            {activeTab === "specs" && (
              <div style={{ overflowX: 'auto' }}>
                {Object.keys(product.specs ?? {}).length > 0 ? (
                  <table className="product-spec-table">
                    <tbody>
                      {Object.entries(product.specs).map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: 'var(--text-3)', textAlign: 'center', padding: '2rem' }}>Chưa có thông số kỹ thuật.</p>
                )}
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === "reviews" && (
              <div>
                {/* Overall Rating */}
                {reviews.length > 0 && (
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem',
                    padding: '1.5rem', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
                    marginBottom: '1.75rem',
                  }}>
                    {/* Big rating number */}
                    <div style={{ textAlign: 'center', minWidth: 100 }}>
                      <div style={{
                        fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, fontFamily: 'var(--font-heading)',
                        background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                      }}>
                        {avgRating.toFixed(1)}
                      </div>
                      <div style={{ display: 'flex', gap: '0.1rem', justifyContent: 'center', margin: '0.4rem 0' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} style={{ color: s <= Math.round(avgRating) ? '#fbbf24' : 'var(--border-2)', fontSize: '1rem' }}>★</span>
                        ))}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{reviews.length} đánh giá</div>
                    </div>
                    {/* Bars */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      {ratingCounts.map(({ star, count }) => (
                        <div key={star} className="review-stars-bar">
                          <span className="review-stars-bar__label">{star}</span>
                          <span style={{ color: '#fbbf24', fontSize: '0.75rem' }}>★</span>
                          <div className="review-stars-bar__track">
                            <div className="review-stars-bar__fill" style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%' }} />
                          </div>
                          <span className="review-stars-bar__count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Write Review Form */}
                {user ? (
                  <form onSubmit={handleSubmitReview} style={{
                    padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', marginBottom: '1.75rem',
                  }}>
                    <h4 style={{ color: 'var(--text)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Viết đánh giá của bạn</h4>
                    <div style={{ marginBottom: '0.85rem' }}>
                      <label style={{ color: 'var(--text-2)', fontSize: '0.82rem', display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Chất lượng sản phẩm:</label>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s} type="button" onClick={() => setReviewRating(s)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.6rem', color: s <= reviewRating ? '#fbbf24' : 'var(--border-2)', transition: 'all 0.2s', padding: '0.1rem' }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.3)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                          >★</button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này…" rows={3} required
                      style={{
                        width: '100%', padding: '0.85rem 1rem', boxSizing: 'border-box',
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 'var(--r-sm)', color: 'var(--text)', fontSize: '0.9rem',
                        fontFamily: 'var(--font)', resize: 'vertical', marginBottom: '0.85rem',
                        outline: 'none', transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.06)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    <button
                      className="btn-primary btn-sm" type="submit" disabled={submittingReview}
                      style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem', fontWeight: 700 }}
                    >
                      {submittingReview ? "Đang gửi…" : "📤 Gửi đánh giá"}
                    </button>
                  </form>
                ) : (
                  <div style={{ padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--r)', marginBottom: '1.5rem', fontSize: '0.88rem', color: 'var(--text-3)' }}>
                    <Link href="/login" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: 600 }}>Đăng nhập</Link> để viết đánh giá.
                  </div>
                )}

                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💬</div>
                    <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {reviews.map((rv) => (
                      <div key={rv.id} style={{
                        padding: '1.25rem', background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
                        transition: 'border-color 0.2s',
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-2)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: 38, height: 38, borderRadius: '50%',
                              background: 'var(--grad-brand)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.88rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                            }}>
                              {rv.userName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.88rem' }}>{rv.userName}</div>
                              <div style={{ display: 'flex', gap: '0.1rem', marginTop: '0.15rem' }}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <span key={s} style={{ color: s <= rv.rating ? '#fbbf24' : 'var(--border-2)', fontSize: '0.78rem' }}>★</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>
                            {new Date(rv.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', lineHeight: 1.65, margin: 0, paddingLeft: '3.25rem' }}>
                          {rv.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ═══════════════ RELATED PRODUCTS ═══════════════ */}
          {related.length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{
                  fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, margin: 0,
                  display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)',
                }}>
                  🔥 <span style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Sản phẩm liên quan</span>
                </h2>
                <Link href={`/products/${category}`} style={{ color: 'var(--cyan)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Xem tất cả →
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
                {related.map((rp) => (
                  <RelatedCard key={rp.id} product={rp} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes stockPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
        }
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AddToCartBtn({ addingCart, onClick }: { addingCart: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button" onClick={onClick} disabled={addingCart}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', padding: '0.9rem 1.5rem', border: 'none', borderRadius: 'var(--r-lg)',
        background: hov ? 'linear-gradient(135deg, #00d4ff, #a855f7)' : 'var(--grad-brand)',
        color: '#fff', fontSize: '1rem', fontWeight: 800, cursor: addingCart ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        transition: 'all 0.3s', opacity: addingCart ? 0.75 : 1,
        boxShadow: hov ? '0 8px 30px rgba(0,212,255,0.35)' : '0 4px 20px rgba(0,212,255,0.2)',
        transform: hov ? 'translateY(-1px)' : 'none',
        letterSpacing: '0.02em',
      }}
    >
      🛒 {addingCart ? 'Đang thêm…' : 'Thêm vào giỏ hàng'}
    </button>
  );
}

function AIQueryBtn({ href }: { href: string }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, padding: '0.75rem 1rem', borderRadius: 'var(--r-lg)',
        background: hov ? 'rgba(168,85,247,0.15)' : 'rgba(168,85,247,0.07)',
        border: hov ? '1px solid rgba(168,85,247,0.4)' : '1px solid rgba(168,85,247,0.2)',
        color: 'var(--purple)', fontSize: '0.87rem', fontWeight: 700,
        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.25s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
        textDecoration: 'none',
        transform: hov ? 'translateY(-1px)' : 'none',
      }}
    >
      🤖 Hỏi AI
    </Link>
  );
}

function WishlistBtn({ inWishlist, onClick }: { inWishlist: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button" onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, padding: '0.75rem 1rem', borderRadius: 'var(--r-lg)',
        background: inWishlist ? 'rgba(244,63,94,0.12)' : hov ? 'rgba(244,63,94,0.1)' : 'rgba(255,255,255,0.04)',
        border: inWishlist ? '1px solid rgba(244,63,94,0.35)' : hov ? '1px solid rgba(244,63,94,0.3)' : '1px solid var(--border)',
        color: inWishlist ? '#f43f5e' : hov ? '#f43f5e' : 'var(--text-2)',
        fontSize: '0.87rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
        transform: hov ? 'translateY(-1px)' : 'none',
      }}
    >
      {inWishlist ? '❤️ Đã yêu thích' : '🤍 Yêu thích'}
    </button>
  );
}

function RelatedCard({ product }: { product: Product }) {
  const [hov, setHov] = useState(false);
  const price = product.discountPrice ?? product.price;
  const discPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.category}/${product.id}`}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        textDecoration: 'none', display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,0.03)', border: hov ? '1px solid rgba(0,212,255,0.3)' : '1px solid var(--border)',
        borderRadius: 'var(--r-lg)', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hov ? '0 12px 35px rgba(0,212,255,0.1)' : 'none',
      }}
    >
      <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: hov ? 'rgba(0,212,255,0.04)' : 'rgba(255,255,255,0.02)', transition: 'background 0.3s', position: 'relative' }}>
        {discPct > 0 && (
          <span style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'linear-gradient(135deg, #f97316, #ef4444)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '999px' }}>-{discPct}%</span>
        )}
        <img
          src={resolveProductImage(product.image, product.category)} alt={product.name} loading="lazy"
          onError={(e) => { e.currentTarget.src = resolveProductImage(null); }}
          style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain', transition: 'transform 0.3s', transform: hov ? 'scale(1.08)' : 'scale(1)' }}
        />
      </div>
      <div style={{ padding: '0.85rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <span style={{ color: 'var(--cyan)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.brand}</span>
        <h3 style={{
          color: 'var(--text)', fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.4, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden',
        }}>{product.name}</h3>
        <div style={{ marginTop: 'auto', paddingTop: '0.35rem', display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--cyan)', fontWeight: 800, fontSize: '0.95rem', fontFamily: 'var(--font-heading)' }}>
            {new Intl.NumberFormat("vi-VN").format(price)}₫
          </span>
          {discPct > 0 && (
            <span style={{ color: 'var(--text-3)', fontSize: '0.72rem', textDecoration: 'line-through' }}>
              {new Intl.NumberFormat("vi-VN").format(product.price)}₫
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
