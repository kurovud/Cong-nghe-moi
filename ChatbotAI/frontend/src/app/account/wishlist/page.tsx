"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { cartApi, wishlistApi } from "@/services/conference.api";
import { resolveProductImage } from "@/lib/product-image";
import { getAllProducts, getAllPrebuiltPCs } from "@/lib/productStore";

const formatVND = (value: number) => new Intl.NumberFormat("vi-VN").format(value) + "₫";

const normalizeLookupKey = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();

const productLookup = new Map<string, any>();
getAllProducts().forEach((product) => productLookup.set(product.id, product));
getAllPrebuiltPCs().forEach((product) => productLookup.set(product.id, { ...product, category: "prebuilt" }));

const productNameLookup = new Map<string, any>();
[...getAllProducts(), ...getAllPrebuiltPCs()].forEach((product) => productNameLookup.set(normalizeLookupKey(product.name), product));

const isPlaceholderImage = (value?: string | null) =>
  !value || value.startsWith("data:image/svg+xml") || value.includes("No%20image") || value.includes("No image");

const resolveWishlistItem = (item: any) => {
  const product =
    productLookup.get(item.productId) ||
    (item.name ? productNameLookup.get(normalizeLookupKey(item.name)) : undefined);
  const imageSource = !isPlaceholderImage(item.image) ? item.image : product?.image;
  const price = Number(item.discountPrice ?? product?.discountPrice ?? item.price ?? product?.price ?? 0);
  const originalPrice = Number(item.price ?? product?.price ?? price);

  return {
    ...item,
    name: item.name || product?.name || item.productId,
    brand: item.brand || product?.brand || "PC Builder Shop",
    category: item.category || product?.category || "prebuilt",
    price: Number.isFinite(originalPrice) ? originalPrice : 0,
    discountPrice: Number.isFinite(price) ? price : undefined,
    image: resolveProductImage(imageSource, item.category || product?.category),
    description: item.description || product?.shortDesc || "Sản phẩm đã được lưu trong danh sách yêu thích của bạn.",
  };
};

export default function WishlistPage() {
  const { user, cart, wishlist, refreshWishlist, refreshCart } = useAuth();
  const [busyProductId, setBusyProductId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const hydratedWishlist = wishlist.map(resolveWishlistItem);
  const totalValue = hydratedWishlist.reduce((sum, item) => sum + Number(item.discountPrice ?? item.price ?? 0), 0);

  const remove = async (productId: string) => {
    if (!user) return;
    setActionError("");
    setBusyProductId(productId);

    try {
      await wishlistApi.removeItem(productId);
      await refreshWishlist();
    } catch {
      setActionError("Không thể xóa sản phẩm khỏi danh sách yêu thích.");
    } finally {
      setBusyProductId(null);
    }
  };

  const addToCart = async (item: any) => {
    if (!user) return;
    setActionError("");
    setBusyProductId(item.productId);

    try {
      const nextItems = [...cart.items];
      const existing = nextItems.find((cartItem) => cartItem.productId === item.productId);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, existing.maxStock || 999);
      } else {
        nextItems.push({ ...item, quantity: 1, maxStock: 999 });
      }

      await cartApi.updateItems(nextItems as any[]);
      await refreshCart();
    } catch {
      setActionError("Không thể thêm sản phẩm vào giỏ hàng.");
    } finally {
      setBusyProductId(null);
    }
  };

  if (!user) {
    return (
      <div className="container section">
        <div
          style={{
            padding: "2rem",
            borderRadius: "var(--r-lg)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(20px)",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, color: "var(--text-2)" }}>
            Vui lòng <Link href="/login" style={{ color: "var(--cyan)", fontWeight: 600 }}>đăng nhập</Link> để xem danh sách yêu thích.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="breadcrumb__sep">/</span>
          <Link href="/account">Tài khoản</Link>
          <span className="breadcrumb__sep">/</span>
          <span>Yêu thích</span>
        </nav>
      </div>

      <section className="section">
        <div className="container">

          {/* Header Card */}
          <div
            style={{
              padding: "1.75rem",
              borderRadius: "var(--r-2xl)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(20px)",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              {/* Title & Description */}
              <div style={{ display: "grid", gap: "0.6rem", flex: 1, minWidth: 280 }}>
                <span
                  style={{
                    display: "inline-flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.42rem 0.85rem",
                    borderRadius: "999px",
                    background: "rgba(239,68,68,0.1)",
                    color: "var(--red)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    border: "1px solid rgba(239,68,68,0.2)",
                  }}
                >
                  ❤️ Danh sách yêu thích
                </span>
                <h1 style={{
                  margin: 0,
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}>
                  <span className="gradient-text">Sản phẩm yêu thích</span>
                  <span style={{ color: "var(--text-3)", fontSize: "0.7em", marginLeft: "0.5rem" }}>
                    ({wishlist.length})
                  </span>
                </h1>
                <p style={{
                  margin: 0,
                  color: "var(--text-3)",
                  maxWidth: 720,
                  lineHeight: 1.6,
                  fontSize: "0.9rem",
                }}>
                  Lưu lại các sản phẩm bạn quan tâm, so sánh nhanh giá và đẩy ngay sang giỏ hàng khi đã sẵn sàng mua.
                </p>
              </div>

              {/* Stats Box */}
              <div
                style={{
                  minWidth: 260,
                  padding: "1.1rem 1.25rem",
                  borderRadius: "var(--r-lg)",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-2)",
                  display: "grid",
                  gap: "0.7rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
                  <span style={{ color: "var(--text-3)", fontWeight: 600, fontSize: "0.88rem" }}>Tổng mục</span>
                  <strong style={{
                    color: "var(--text)",
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.1rem",
                  }}>{wishlist.length}</strong>
                </div>
                <div style={{
                  height: 1,
                  background: "var(--border)",
                }} />
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
                  <span style={{ color: "var(--text-3)", fontWeight: 600, fontSize: "0.88rem" }}>Tổng giá trị</span>
                  <strong style={{ fontSize: "1.1rem" }}>
                    <span className="gradient-text">{formatVND(totalValue)}</span>
                  </strong>
                </div>
                <Link
                  href="/products"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    marginTop: "0.25rem",
                    padding: "0.65rem 1rem",
                    borderRadius: "var(--r)",
                    background: "transparent",
                    border: "1px solid var(--border-2)",
                    color: "var(--text-2)",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    textDecoration: "none",
                    fontFamily: "var(--font-heading)",
                    transition: "all 0.2s var(--ease)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--cyan)";
                    e.currentTarget.style.color = "var(--cyan)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-2)";
                    e.currentTarget.style.color = "var(--text-2)";
                  }}
                >
                  Khám phá thêm sản phẩm →
                </Link>
              </div>
            </div>
          </div>

          {/* Error Toast */}
          {actionError && (
            <div
              style={{
                padding: "0.85rem 1.1rem",
                borderRadius: "var(--r)",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "var(--red)",
                fontWeight: 600,
                fontSize: "0.9rem",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              ⚠️ {actionError}
            </div>
          )}

          {/* Empty State */}
          {hydratedWishlist.length === 0 ? (
            <div
              style={{
                display: "grid",
                placeItems: "center",
                gap: "1rem",
                minHeight: 360,
                textAlign: "center",
                padding: "2.5rem",
                borderRadius: "var(--r-xl)",
                border: "1px dashed var(--border-2)",
                background: "var(--surface)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.2rem",
                animation: "pulse 2s infinite",
              }}>
                🤍
              </div>
              <h2 style={{
                margin: 0,
                fontFamily: "var(--font-heading)",
                color: "var(--text)",
                fontSize: "1.4rem",
                fontWeight: 700,
              }}>Chưa có sản phẩm yêu thích</h2>
              <p style={{
                margin: 0,
                color: "var(--text-3)",
                maxWidth: 480,
                lineHeight: 1.6,
                fontSize: "0.9rem",
              }}>
                Hãy thêm những sản phẩm bạn thích để quay lại xem nhanh, so sánh và mua ngay khi cần.
              </p>
              <Link
                href="/products"
                style={{
                  marginTop: "0.5rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.8rem 1.8rem",
                  borderRadius: "var(--r)",
                  background: "var(--grad-brand)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  fontFamily: "var(--font-heading)",
                  textDecoration: "none",
                  boxShadow: "var(--shadow-cyan)",
                  transition: "transform 0.2s var(--ease)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Xem sản phẩm
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {hydratedWishlist.map((item) => {
                const hasDiscount = item.discountPrice && item.discountPrice < item.price;
                const discountPercent = hasDiscount
                  ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
                  : 0;

                return (
                  <article
                    key={item.productId}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "130px minmax(0, 1fr) auto",
                      gap: "1.25rem",
                      alignItems: "stretch",
                      padding: "1.1rem",
                      borderRadius: "var(--r-lg)",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      backdropFilter: "blur(20px)",
                      transition: "all 0.25s var(--ease)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(0,212,255,0.2)";
                      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.category}/${item.productId}`}
                      style={{
                        position: "relative",
                        borderRadius: "var(--r)",
                        overflow: "hidden",
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        minHeight: 130,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.src = resolveProductImage(null);
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s var(--ease)",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                      />
                      {hasDiscount && discountPercent > 0 && (
                        <span style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          padding: "0.2rem 0.55rem",
                          borderRadius: "999px",
                          background: "var(--grad-orange)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          letterSpacing: "0.02em",
                        }}>
                          -{discountPercent}%
                        </span>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div style={{ display: "grid", gap: "0.7rem", minWidth: 0, alignContent: "start" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                        <div style={{ minWidth: 0 }}>
                          <span style={{
                            display: "inline-block",
                            padding: "0.18rem 0.55rem",
                            borderRadius: "999px",
                            background: "rgba(168,85,247,0.1)",
                            border: "1px solid rgba(168,85,247,0.2)",
                            color: "var(--purple)",
                            fontWeight: 600,
                            fontSize: "0.78rem",
                            marginBottom: "0.3rem",
                          }}>
                            {item.brand}
                          </span>
                          <h3 style={{
                            margin: "0.25rem 0 0",
                            color: "var(--text)",
                            fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
                            fontFamily: "var(--font-heading)",
                            fontWeight: 700,
                            lineHeight: 1.3,
                          }}>
                            {item.name}
                          </h3>
                        </div>
                        <span
                          style={{
                            alignSelf: "flex-start",
                            padding: "0.3rem 0.7rem",
                            borderRadius: 999,
                            background: "rgba(239,68,68,0.08)",
                            border: "1px solid rgba(239,68,68,0.2)",
                            color: "var(--red)",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ❤️ Đã lưu
                        </span>
                      </div>

                      {/* Price */}
                      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                        <strong style={{
                          color: "var(--cyan)",
                          fontSize: "1.1rem",
                          fontFamily: "var(--font-heading)",
                        }}>
                          {formatVND(Number(item.discountPrice ?? item.price ?? 0))}
                        </strong>
                        {item.discountPrice && (
                          <span style={{
                            color: "var(--text-3)",
                            textDecoration: "line-through",
                            fontSize: "0.88rem",
                          }}>
                            {formatVND(Number(item.price ?? 0))}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p
                        style={{
                          margin: 0,
                          color: "var(--text-3)",
                          lineHeight: 1.55,
                          fontSize: "0.88rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      display: "grid",
                      gap: "0.6rem",
                      alignContent: "space-between",
                      justifyItems: "stretch",
                      minWidth: 160,
                    }}>
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        disabled={busyProductId === item.productId}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          borderRadius: "var(--r)",
                          background: busyProductId === item.productId ? "var(--surface-2)" : "var(--grad-brand)",
                          border: "none",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.88rem",
                          fontFamily: "var(--font-heading)",
                          cursor: busyProductId === item.productId ? "not-allowed" : "pointer",
                          transition: "all 0.2s var(--ease)",
                          boxShadow: busyProductId === item.productId ? "none" : "var(--shadow-cyan)",
                          opacity: busyProductId === item.productId ? 0.6 : 1,
                          letterSpacing: "0.02em",
                        }}
                        onMouseEnter={(e) => {
                          if (busyProductId !== item.productId) {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,212,255,0.35)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = busyProductId !== item.productId ? "var(--shadow-cyan)" : "none";
                        }}
                      >
                        {busyProductId === item.productId ? "Đang thêm..." : "🛒 Thêm vào giỏ"}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item.productId)}
                        disabled={busyProductId === item.productId}
                        style={{
                          width: "100%",
                          padding: "0.7rem 1rem",
                          borderRadius: "var(--r)",
                          border: "1px solid rgba(239,68,68,0.3)",
                          background: "rgba(239,68,68,0.06)",
                          color: "var(--red)",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          fontFamily: "var(--font-heading)",
                          cursor: busyProductId === item.productId ? "not-allowed" : "pointer",
                          transition: "all 0.2s var(--ease)",
                          opacity: busyProductId === item.productId ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (busyProductId !== item.productId) {
                            e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                            e.currentTarget.style.borderColor = "var(--red)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(239,68,68,0.06)";
                          e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
                        }}
                      >
                        Xóa khỏi yêu thích
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
