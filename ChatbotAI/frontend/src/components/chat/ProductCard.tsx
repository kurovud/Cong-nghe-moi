"use client";

import type { ProductCard as ProductCardType } from "@/types/chat.type";

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + "₫";

const starRating = (rating: number) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
};

interface Props {
  product: ProductCardType;
  compact?: boolean;
}

const ProductCard = ({ product, compact = false }: Props) => {
  const hasDiscount = !!product.discountPrice;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0;

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: compact ? '0.75rem' : '1rem',
        transition: 'all 0.25s var(--ease)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.3)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Category + Brand header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{
          padding: '0.15rem 0.5rem', borderRadius: 'var(--r-sm)',
          background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
          fontSize: '0.65rem', fontWeight: 700, color: 'var(--cyan)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {product.category.toUpperCase()}
        </span>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {product.brand}
        </span>
      </div>

      {/* Name */}
      <h4 style={{
        fontWeight: 700, fontSize: compact ? '0.85rem' : '0.95rem',
        color: 'var(--text)', lineHeight: 1.4, marginBottom: '0.3rem',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {product.name}
      </h4>

      {/* Description */}
      {product.shortDesc && (
        <p style={{
          fontSize: '0.78rem', color: 'var(--text-2)', lineHeight: 1.5,
          marginBottom: '0.5rem',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {product.shortDesc}
        </p>
      )}

      {/* Specs (only in full mode) */}
      {!compact && product.specs && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 0.75rem',
          padding: '0.5rem', marginBottom: '0.5rem',
          background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.08)',
          borderRadius: 'var(--r-sm)', fontSize: '0.75rem',
        }}>
          {Object.entries(product.specs).slice(0, 4).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.25rem' }}>
              <span style={{ color: 'var(--text-3)' }}>{key}</span>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer: Price + Rating */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 900, fontSize: compact ? '0.9rem' : '1rem', color: 'var(--cyan)' }}>
            {formatVND(product.discountPrice ?? product.price)}
          </span>
          {hasDiscount && (
            <>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', textDecoration: 'line-through' }}>
                {formatVND(product.price)}
              </span>
              <span style={{
                padding: '0.1rem 0.4rem', borderRadius: 'var(--r-sm)',
                background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)',
                fontSize: '0.65rem', fontWeight: 700, color: 'var(--orange)',
              }}>
                -{discountPercent}%
              </span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
          <span style={{ color: '#f59e0b' }}>{starRating(product.rating)}</span>
          <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>{product.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
