"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/types/product.type";
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

const CATEGORY_ICONS: Record<string, string> = {
  cpu: "💻", gpu: "🎮", mainboard: "⚡", ram: "🧠", ssd: "💾",
  hdd: "📀", psu: "⚙️", case: "🖥️", cooler: "🌡️", monitor: "🖥️",
  keyboard: "⌨️", mouse: "🖱️", headset: "🎧", laptop: "💻", prebuilt: "🧩",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  cpu: "linear-gradient(135deg, rgba(0,212,255,0.18) 0%, rgba(168,85,247,0.12) 100%)",
  gpu: "linear-gradient(135deg, rgba(168,85,247,0.18) 0%, rgba(249,115,22,0.12) 100%)",
  mainboard: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(0,212,255,0.10) 100%)",
  ram: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(0,212,255,0.10) 100%)",
  ssd: "linear-gradient(135deg, rgba(0,212,255,0.18) 0%, rgba(16,185,129,0.10) 100%)",
  hdd: "linear-gradient(135deg, rgba(100,116,139,0.2) 0%, rgba(0,212,255,0.08) 100%)",
  psu: "linear-gradient(135deg, rgba(249,115,22,0.18) 0%, rgba(239,68,68,0.10) 100%)",
  case: "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(0,212,255,0.08) 100%)",
  cooler: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(168,85,247,0.08) 100%)",
  monitor: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(168,85,247,0.10) 100%)",
  keyboard: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(168,85,247,0.10) 100%)",
  mouse: "linear-gradient(135deg, rgba(168,85,247,0.18) 0%, rgba(0,212,255,0.10) 100%)",
  headset: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(249,115,22,0.10) 100%)",
  laptop: "linear-gradient(135deg, rgba(0,212,255,0.18) 0%, rgba(168,85,247,0.12) 100%)",
  prebuilt: "linear-gradient(135deg, rgba(168,85,247,0.18) 0%, rgba(249,115,22,0.12) 100%)",
};

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + "₫";

function StarRating({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <div className="cat-star-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= full ? '#fbbf24' : 'var(--border-2)', fontSize: '0.8rem' }}>★</span>
      ))}
      <span className="cat-rating-val">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("default");

  const categoryLabel = CATEGORY_LABELS[category] ?? category;
  const categoryIcon = CATEGORY_ICONS[category] ?? "📦";
  const heroGradient = CATEGORY_GRADIENTS[category] ?? "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(168,85,247,0.10) 100%)";

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?category=${category}&limit=100`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  /* Sorting */
  const sorted = [...products].sort((a, b) => {
    const priceA = a.discountPrice ?? a.price;
    const priceB = b.discountPrice ?? b.price;
    switch (sortBy) {
      case "price-asc":
        return priceA - priceB;
      case "price-desc":
        return priceB - priceA;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="products-page">
      {/* ── Hero Banner ── */}
      <div className="cat-hero" style={{ background: heroGradient }}>
        <div className="cat-hero__bg-grid" />
        <div className="cat-hero__orb cat-hero__orb--1" />
        <div className="cat-hero__orb cat-hero__orb--2" />

        <div className="container cat-hero__inner">
          {/* Breadcrumb */}
          <nav className="cat-breadcrumb">
            <Link href="/" className="cat-breadcrumb__link">Trang chủ</Link>
            <span className="cat-breadcrumb__sep">›</span>
            <Link href="/products" className="cat-breadcrumb__link">Sản phẩm</Link>
            <span className="cat-breadcrumb__sep">›</span>
            <span className="cat-breadcrumb__current">{categoryLabel}</span>
          </nav>

          <div className="cat-hero__content">
            <div className="cat-hero__icon-wrap">
              <span className="cat-hero__icon">{categoryIcon}</span>
            </div>
            <div>
              <h1 className="cat-hero__title gradient-text">{categoryLabel}</h1>
              <p className="cat-hero__sub">
                {products.length > 0 ? (
                  <><strong style={{ color: 'var(--cyan)' }}>{products.length}</strong> sản phẩm chính hãng</>
                ) : (
                  'Đang tải sản phẩm...'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* ── Sort Toolbar ── */}
          <div className="cat-toolbar">
            <div className="cat-toolbar__info">
              {!loading && (
                <span className="cat-toolbar__count">
                  <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{sorted.length}</span> sản phẩm
                </span>
              )}
            </div>
            <div className="cat-toolbar__sort">
              <label htmlFor="cat-sort" className="cat-toolbar__sort-label">Sắp xếp:</label>
              <select
                id="cat-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cat-sort-select"
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="name">Tên A-Z</option>
              </select>
            </div>
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="cat-loading">
              <div className="cat-spinner">
                <div className="cat-spinner__ring cat-spinner__ring--1" />
                <div className="cat-spinner__ring cat-spinner__ring--2" />
                <div className="cat-spinner__ring cat-spinner__ring--3" />
                <span className="cat-spinner__icon">{categoryIcon}</span>
              </div>
              <p className="cat-loading__text">Đang tải <strong>{categoryLabel}</strong>…</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="cat-empty">
              <div className="cat-empty__icon">🔮</div>
              <h3 className="cat-empty__title">Chưa có sản phẩm nào</h3>
              <p className="cat-empty__desc">
                Danh mục <strong style={{ color: 'var(--cyan)' }}>{categoryLabel}</strong> hiện chưa có sản phẩm.<br />
                Hãy quay lại sau hoặc xem các danh mục khác.
              </p>
              <Link href="/products" className="btn btn-primary">
                ← Xem tất cả danh mục
              </Link>
            </div>
          ) : (
            <div className="grid grid-3 product-grid">
              {sorted.map((product) => {
                const discPct = product.discountPrice
                  ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                  : 0;
                const displayPrice = product.discountPrice ?? product.price;

                return (
                  <Link
                    href={`/products/${category}/${product.id}`}
                    key={product.id}
                    className="cat-product-card"
                  >
                    {/* Discount badge */}
                    {discPct > 0 && (
                      <div className="cat-product-card__badge">-{discPct}%</div>
                    )}

                    {/* Image */}
                    <div className="cat-product-card__img-wrap">
                      <img
                        src={resolveProductImage(product.image, product.category)}
                        alt={product.name}
                        loading="lazy"
                        className="cat-product-card__img"
                        onError={(event) => {
                          event.currentTarget.src = resolveProductImage(null);
                        }}
                      />
                      <div className="cat-product-card__img-glow" />
                    </div>

                    {/* Body */}
                    <div className="cat-product-card__body">
                      {product.brand && (
                        <span className="cat-product-card__brand">{product.brand}</span>
                      )}
                      <h3 className="cat-product-card__name">{product.name}</h3>
                      {product.shortDesc && (
                        <p className="cat-product-card__desc">{product.shortDesc}</p>
                      )}
                      <StarRating rating={product.rating ?? 0} />

                      <div className="cat-product-card__pricing">
                        <span className="cat-product-card__price">
                          {formatVND(displayPrice)}
                        </span>
                        {discPct > 0 && (
                          <span className="cat-product-card__old-price">
                            {formatVND(product.price)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="cat-product-card__footer">
                      <span className={`cat-product-card__stock ${product.stock > 0 ? 'in' : 'out'}`}>
                        {product.stock > 0 ? `✅ Còn ${product.stock}` : "❌ Hết hàng"}
                      </span>
                      <span className="cat-product-card__cta">Xem chi tiết →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <style>{`
        /* ── Cat Hero ── */
        .cat-hero {
          position: relative;
          overflow: hidden;
          padding: 3rem 0 2.5rem;
          border-bottom: 1px solid var(--border);
        }
        .cat-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--bg);
          opacity: 0.55;
        }
        .cat-hero__bg-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
        .cat-hero__orb {
          position: absolute; border-radius: 50%;
          pointer-events: none;
          animation: float 8s ease-in-out infinite;
        }
        .cat-hero__orb--1 {
          width: 400px; height: 400px; top: -150px; right: -50px;
          background: radial-gradient(circle, rgba(0,212,255,0.08), transparent 70%);
        }
        .cat-hero__orb--2 {
          width: 250px; height: 250px; bottom: -80px; left: 10%;
          background: radial-gradient(circle, rgba(168,85,247,0.07), transparent 70%);
          animation-delay: -3s;
        }
        .cat-hero__inner { position: relative; z-index: 2; }
        .cat-hero__content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .cat-hero__icon-wrap {
          width: 72px; height: 72px;
          border-radius: var(--r-lg);
          background: var(--surface-2);
          border: 1px solid var(--border-2);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
          box-shadow: 0 0 30px rgba(0,212,255,0.15), var(--shadow-md);
          backdrop-filter: blur(4px);
          flex-shrink: 0;
        }
        .cat-hero__title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 0.3rem;
        }
        .cat-hero__sub { color: var(--text-2); font-size: 1rem; }

        /* ── Breadcrumb ── */
        .cat-breadcrumb {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.82rem;
        }
        .cat-breadcrumb__link {
          color: var(--text-3);
          text-decoration: none;
          transition: color 0.2s;
        }
        .cat-breadcrumb__link:hover { color: var(--cyan); }
        .cat-breadcrumb__sep { color: var(--text-3); }
        .cat-breadcrumb__current { color: var(--text-2); font-weight: 500; }

        /* ── Toolbar ── */
        .cat-toolbar {
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          margin-bottom: 2rem;
          backdrop-filter: blur(4px);
        }
        .cat-toolbar__count { font-size: 0.9rem; color: var(--text-2); }
        .cat-toolbar__sort { display: flex; align-items: center; gap: 0.6rem; }
        .cat-toolbar__sort-label { font-size: 0.83rem; color: var(--text-2); white-space: nowrap; }
        .cat-sort-select {
          height: 38px; padding: 0 2.2rem 0 0.9rem;
          background: var(--surface-2);
          border: 1px solid var(--border-2);
          border-radius: var(--r);
          color: var(--text); font-size: 0.85rem; font-family: inherit;
          outline: none; cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.6rem center;
          transition: border-color 0.2s;
        }
        .cat-sort-select:focus { border-color: rgba(0,212,255,0.4); }
        .cat-sort-select option { background: #0e1a2e; }

        /* ── Loading Spinner ── */
        .cat-loading {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 6rem 2rem;
          gap: 1.5rem;
        }
        .cat-spinner {
          position: relative;
          width: 80px; height: 80px;
          display: flex; align-items: center; justify-content: center;
        }
        .cat-spinner__ring {
          position: absolute; border-radius: 50%;
          border: 2px solid transparent;
          animation: spin 1.2s linear infinite;
        }
        .cat-spinner__ring--1 {
          inset: 0;
          border-top-color: var(--cyan);
          box-shadow: 0 0 16px rgba(0,212,255,0.3);
        }
        .cat-spinner__ring--2 {
          inset: 8px;
          border-top-color: var(--purple);
          animation-duration: 0.9s;
          animation-direction: reverse;
          box-shadow: 0 0 12px rgba(168,85,247,0.3);
        }
        .cat-spinner__ring--3 {
          inset: 18px;
          border-top-color: var(--orange);
          animation-duration: 1.5s;
          box-shadow: 0 0 8px rgba(249,115,22,0.3);
        }
        .cat-spinner__icon {
          font-size: 1.4rem;
          position: relative; z-index: 1;
        }
        .cat-loading__text { color: var(--text-2); font-size: 1rem; }

        /* ── Empty State ── */
        .cat-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 5rem 2rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-2xl);
          animation: fadeIn 0.4s var(--ease);
        }
        .cat-empty__icon {
          font-size: 4rem; margin-bottom: 1.25rem;
          filter: drop-shadow(0 0 24px rgba(168,85,247,0.4));
          animation: float 5s ease-in-out infinite;
        }
        .cat-empty__title { font-size: 1.4rem; font-weight: 700; color: var(--text); margin-bottom: 0.6rem; }
        .cat-empty__desc { color: var(--text-2); max-width: 380px; margin-bottom: 2rem; line-height: 1.7; }

        /* ── Product Cards ── */
        .cat-product-card {
          position: relative;
          display: flex; flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-xl);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s var(--ease);
          box-shadow: var(--shadow-card);
        }
        .cat-product-card:hover {
          border-color: rgba(0,212,255,0.25);
          box-shadow: 0 0 0 1px rgba(0,212,255,0.1), 0 16px 40px rgba(0,212,255,0.1), var(--shadow-card);
          transform: translateY(-4px);
        }
        .cat-product-card__badge {
          position: absolute; top: 0.65rem; right: 0.65rem; z-index: 3;
          background: var(--grad-orange);
          color: #fff; font-size: 0.72rem; font-weight: 800;
          padding: 0.18rem 0.5rem; border-radius: var(--r-full);
          box-shadow: 0 2px 12px rgba(249,115,22,0.4);
          pointer-events: none;
        }
        .cat-product-card__img-wrap {
          position: relative;
          background: linear-gradient(135deg, var(--surface-2), var(--bg-3));
          aspect-ratio: 1 / 1;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .cat-product-card__img {
          width: 75%; height: 75%;
          object-fit: contain;
          transition: transform 0.4s var(--ease);
        }
        .cat-product-card:hover .cat-product-card__img { transform: scale(1.08); }
        .cat-product-card__img-glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 60%, rgba(0,212,255,0.06), transparent 70%);
          opacity: 0; transition: opacity 0.3s;
        }
        .cat-product-card:hover .cat-product-card__img-glow { opacity: 1; }
        .cat-product-card__body { padding: 1rem 1rem 0.5rem; flex: 1; }
        .cat-product-card__brand {
          display: inline-block;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
          color: var(--purple);
          background: rgba(168,85,247,0.1);
          border: 1px solid rgba(168,85,247,0.2);
          padding: 0.1rem 0.5rem; border-radius: var(--r-full);
          margin-bottom: 0.4rem;
        }
        .cat-product-card__name {
          font-size: 0.92rem; font-weight: 600; color: var(--text);
          line-height: 1.4; margin-bottom: 0.35rem;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .cat-product-card__desc {
          font-size: 0.78rem; color: var(--text-3); line-height: 1.5;
          margin-bottom: 0.5rem;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .cat-star-row {
          display: flex; align-items: center; gap: 0.1rem;
          margin-bottom: 0.6rem;
        }
        .cat-rating-val {
          font-size: 0.72rem; color: var(--text-3);
          margin-left: 0.3rem; font-weight: 500;
        }
        .cat-product-card__pricing {
          display: flex; align-items: baseline; gap: 0.5rem; flex-wrap: wrap;
        }
        .cat-product-card__price {
          font-size: 1.05rem; font-weight: 800;
          background: var(--grad-brand);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .cat-product-card__old-price {
          font-size: 0.78rem; color: var(--text-3);
          text-decoration: line-through;
        }
        .cat-product-card__footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.75rem 1rem;
          border-top: 1px solid var(--border);
          margin-top: 0.75rem;
        }
        .cat-product-card__stock { font-size: 0.78rem; }
        .cat-product-card__stock.in { color: var(--green); }
        .cat-product-card__stock.out { color: var(--red); }
        .cat-product-card { position: relative; }
        .cat-product-card__cta {
          font-size: 0.8rem; font-weight: 600; color: var(--cyan);
          position: absolute; right: 12px; bottom: 12px;
          opacity: 0; transform: translateY(6px);
          transition: opacity 180ms var(--ease), transform 180ms var(--ease);
          pointer-events: none;
        }
        .cat-product-card:hover .cat-product-card__cta { opacity: 1; transform: translateY(0); pointer-events: auto; }
      `}</style>
    </div>
  );
}
