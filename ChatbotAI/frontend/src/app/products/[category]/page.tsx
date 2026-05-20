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

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + "₫";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("default");

  const categoryLabel = CATEGORY_LABELS[category] ?? category;

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
      {/* Breadcrumb */}
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="breadcrumb__sep">/</span>
          <Link href="/products">Sản phẩm</Link>
          <span className="breadcrumb__sep">/</span>
          <span>{categoryLabel}</span>
        </nav>
      </div>

      <section className="section">
        <div className="container">
          {/* Header + Sort */}
          <div className="category-header">
            <div>
              <h2>{categoryLabel}</h2>
              <p className="category-header__count">
                {products.length} sản phẩm
              </p>
            </div>
            <div className="category-header__sort">
              <label htmlFor="sort">Sắp xếp:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="category-header__select"
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="name">Tên A-Z</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="products-loading">
              <div className="spinner" />
              <p>Đang tải sản phẩm…</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="products-empty">
              <p>😕 Chưa có sản phẩm nào trong danh mục này.</p>
              <Link href="/products" className="button btn-sm">
                ← Quay lại danh mục
              </Link>
            </div>
          ) : (
            <div className="grid grid-3 product-grid">
              {sorted.map((product) => (
                <Link
                  href={`/products/${category}/${product.id}`}
                  key={product.id}
                  className="product-card"
                >
                  <div className="product-card__image">
                    <img
                      src={resolveProductImage(product.image, product.category)}
                      alt={product.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = resolveProductImage(null);
                      }}
                    />
                    {product.discountPrice && (
                      <span className="product-card__badge">
                        -
                        {Math.round(
                          ((product.price - product.discountPrice) /
                            product.price) *
                            100
                        )}
                        %
                      </span>
                    )}
                  </div>
                  <div className="product-card__body">
                    <span className="product-card__brand">{product.brand}</span>
                    <h3 className="product-card__name">{product.name}</h3>
                    <p className="product-card__desc">{product.shortDesc}</p>
                    <div className="product-card__rating">
                      {"⭐".repeat(Math.round(product.rating))}
                      <span>{product.rating}/5</span>
                    </div>
                    <div className="product-card__pricing">
                      {product.discountPrice ? (
                        <>
                          <span className="product-card__price product-card__price--sale">
                            {formatVND(product.discountPrice)}
                          </span>
                          <span className="product-card__price product-card__price--old">
                            {formatVND(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="product-card__price">
                          {formatVND(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="product-card__footer">
                    <span className="product-card__stock">
                      {product.stock > 0 ? `✅ Còn ${product.stock}` : "❌ Hết hàng"}
                    </span>
                    <span className="button btn-sm">Xem chi tiết →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
