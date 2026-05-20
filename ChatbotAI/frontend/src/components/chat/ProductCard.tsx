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
  return (
    <div className="product-card">
      <div className="product-card__header">
        <div className="product-card__badge">{product.category.toUpperCase()}</div>
        <span className="product-card__brand">{product.brand}</span>
      </div>
      <h4 className="product-card__name">{product.name}</h4>
      <p className="product-card__desc">{product.shortDesc}</p>

      {!compact && (
        <div className="product-card__specs">
          {Object.entries(product.specs).slice(0, 4).map(([key, value]) => (
            <div key={key} className="product-card__spec">
              <span className="product-card__spec-key">{key}</span>
              <span className="product-card__spec-value">{value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="product-card__footer">
        <div className="product-card__price">
          <span className="product-card__price-current">
            {formatVND(product.discountPrice ?? product.price)}
          </span>
          {product.discountPrice && (
            <span className="product-card__price-original">
              {formatVND(product.price)}
            </span>
          )}
        </div>
        <div className="product-card__rating">
          <span className="product-card__stars">{starRating(product.rating)}</span>
          <span className="product-card__rating-num">{product.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
