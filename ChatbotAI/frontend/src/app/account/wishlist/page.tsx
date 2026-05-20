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
            padding: "1.5rem",
            borderRadius: "20px",
            border: "1px solid rgba(255,143,31,0.12)",
            background: "linear-gradient(135deg, rgba(255,250,252,0.96), rgba(247,251,255,0.98))",
          }}
        >
          <p style={{ margin: 0, color: "#162033" }}>
            Vui lòng <Link href="/login">đăng nhập</Link> để xem danh sách yêu thích.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
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
          <div
            style={{
              display: "grid",
              gap: "1rem",
              padding: "1.4rem",
              borderRadius: "24px",
              border: "1px solid rgba(255,143,31,0.12)",
              background: "linear-gradient(135deg, rgba(255,250,252,0.96), rgba(247,251,255,0.98))",
              boxShadow: "0 18px 48px rgba(18,32,51,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "grid", gap: "0.55rem" }}>
                <span
                  style={{
                    display: "inline-flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.42rem 0.8rem",
                    borderRadius: "999px",
                    background: "rgba(255,179,193,0.22)",
                    color: "#162033",
                    fontWeight: 800,
                    border: "1px solid rgba(255,143,31,0.12)",
                  }}
                >
                  ❤️ Danh sách yêu thích
                </span>
                <h1 style={{ margin: 0, color: "#162033", fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
                  Sản phẩm yêu thích ({wishlist.length})
                </h1>
                <p style={{ margin: 0, color: "#4a5568", maxWidth: 720, lineHeight: 1.6 }}>
                  Lưu lại các sản phẩm bạn quan tâm, so sánh nhanh giá và đẩy ngay sang giỏ hàng khi đã sẵn sàng mua.
                </p>
              </div>

              <div
                style={{
                  minWidth: 260,
                  padding: "1rem 1.1rem",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(255,143,31,0.12)",
                  display: "grid",
                  gap: "0.6rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                  <span style={{ color: "#7c8fa6", fontWeight: 700 }}>Tổng mục</span>
                  <strong style={{ color: "#162033" }}>{wishlist.length}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                  <span style={{ color: "#7c8fa6", fontWeight: 700 }}>Tổng giá trị</span>
                  <strong style={{ color: "#ff6b9d" }}>{formatVND(totalValue)}</strong>
                </div>
                <Link href="/products" className="button btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                  Khám phá thêm sản phẩm
                </Link>
              </div>
            </div>

            {actionError && (
              <div
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "14px",
                  background: "rgba(255,179,193,0.18)",
                  border: "1px solid rgba(255,143,31,0.16)",
                  color: "#162033",
                  fontWeight: 700,
                }}
              >
                {actionError}
              </div>
            )}

            {hydratedWishlist.length === 0 ? (
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  gap: "0.9rem",
                  minHeight: 320,
                  textAlign: "center",
                  padding: "1.5rem",
                  borderRadius: "20px",
                  border: "1px dashed rgba(255,143,31,0.18)",
                  background: "linear-gradient(135deg, rgba(255,250,252,0.9), rgba(247,251,255,0.92))",
                }}
              >
                <div style={{ fontSize: "3rem" }}>🤍</div>
                <h2 style={{ margin: 0, color: "#162033" }}>Chưa có sản phẩm yêu thích</h2>
                <p style={{ margin: 0, color: "#4a5568", maxWidth: 480 }}>
                  Hãy thêm những sản phẩm bạn thích để quay lại xem nhanh, so sánh và mua ngay khi cần.
                </p>
                <Link href="/products" className="button hero__btn-primary">
                  Xem sản phẩm
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {hydratedWishlist.map((item) => (
                  <article
                    key={item.productId}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px minmax(0, 1fr) auto",
                      gap: "1rem",
                      alignItems: "stretch",
                      padding: "1rem",
                      borderRadius: "20px",
                      background: "rgba(255,255,255,0.82)",
                      border: "1px solid rgba(255,143,31,0.12)",
                      boxShadow: "0 10px 28px rgba(18,32,51,0.06)",
                    }}
                  >
                    <Link
                      href={`/products/${item.category}/${item.productId}`}
                      style={{
                        position: "relative",
                        borderRadius: "16px",
                        overflow: "hidden",
                        background: "linear-gradient(135deg, rgba(255,179,193,0.16), rgba(183,216,255,0.16))",
                        border: "1px solid rgba(255,143,31,0.10)",
                        minHeight: 120,
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.src = resolveProductImage(null);
                        }}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Link>

                    <div style={{ display: "grid", gap: "0.75rem", minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                        <div style={{ minWidth: 0 }}>
                          <span style={{ color: "#7c8fa6", fontWeight: 700, fontSize: "0.86rem" }}>{item.brand}</span>
                          <h3 style={{ margin: "0.25rem 0 0", color: "#162033", fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>{item.name}</h3>
                        </div>
                        <span
                          style={{
                            alignSelf: "flex-start",
                            padding: "0.35rem 0.75rem",
                            borderRadius: 999,
                            background: "rgba(255,179,193,0.18)",
                            border: "1px solid rgba(255,143,31,0.10)",
                            color: "#162033",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                          }}
                        >
                          ❤️ Đã lưu
                        </span>
                      </div>

                      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                        <strong style={{ color: "#162033", fontSize: "1.08rem" }}>{formatVND(Number(item.discountPrice ?? item.price ?? 0))}</strong>
                        {item.discountPrice && (
                          <span style={{ color: "#7c8fa6", textDecoration: "line-through", fontSize: "0.92rem" }}>
                            {formatVND(Number(item.price ?? 0))}
                          </span>
                        )}
                      </div>

                      <p
                        style={{
                          margin: 0,
                          color: "#4a5568",
                          lineHeight: 1.55,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.description}
                      </p>
                    </div>

                    <div style={{ display: "grid", gap: "0.65rem", alignContent: "space-between", justifyItems: "stretch", minWidth: 150 }}>
                      <button type="button"
                        className="button btn-sm"
                        onClick={() => addToCart(item)}
                        disabled={busyProductId === item.productId}
                        style={{ width: "100%" }}
                      >
                        {busyProductId === item.productId ? "Đang thêm..." : "Thêm vào giỏ"}
                      </button>
                      <button type="button"
                        onClick={() => remove(item.productId)}
                        disabled={busyProductId === item.productId}
                        style={{
                          width: "100%",
                          padding: "0.7rem 0.95rem",
                          borderRadius: "12px",
                          border: "1px solid rgba(255,143,31,0.16)",
                          background: "rgba(255,255,255,0.88)",
                          color: "#162033",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Xóa khỏi yêu thích
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
