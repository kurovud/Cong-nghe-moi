"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import type { PaymentMethod, ShippingAddress } from "@/types/order.type";
import { orderApi } from "@/services/conference.api";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "₫";

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string; color: string }[] = [
  { value: "cod", label: "Thanh toán khi nhận hàng (COD)", icon: "💵", color: "#10b981" },
  { value: "bank_transfer", label: "Chuyển khoản ngân hàng", icon: "🏦", color: "#3b82f6" },
  { value: "momo", label: "Ví MoMo", icon: "📱", color: "#e91e8c" },
  { value: "zalopay", label: "Ví ZaloPay", icon: "💳", color: "#00b14f" },
  { value: "credit_card", label: "Thẻ tín dụng / ghi nợ", icon: "💳", color: "#f97316" },
];

export default function CheckoutPage() {
  const { cart, user, refreshCart, refreshNotifications } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState<ShippingAddress>(
    user?.addresses?.[0] ?? {
      fullName: user?.name ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
      province: "",
      district: "",
      ward: "",
      address: "",
      note: "",
    }
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [orderNote, setOrderNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const subtotal = cart.totalPrice;

  const applyCoupon = async () => {
    try {
      const data = await orderApi.validateCoupon(couponCode, subtotal);
      const valid = data?.data?.valid;
      const discount = Number(data?.data?.discount || 0);
      setCouponDiscount(valid ? discount : 0);
      setCouponMsg(valid ? `Áp dụng thành công: -${formatVND(discount)}` : "Mã giảm giá không hợp lệ");
    } catch (error: any) {
      setCouponDiscount(0);
      setCouponMsg(error?.message || "Mã giảm giá không hợp lệ");
    }
  };

  const calcShipping = () => {
    setShippingFee(subtotal >= 2_000_000 ? 0 : 30_000);
  };

  const total = subtotal + shippingFee - couponDiscount;

  const placeOrder = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!address.fullName || !address.phone || !address.province || !address.address) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }
    if (!agreed) {
      alert("Vui lòng đồng ý với điều khoản mua hàng");
      return;
    }
    setPlacing(true);
    try {
      const paymentMethodMap: Record<PaymentMethod, string> = {
        cod: "COD",
        bank_transfer: "BANK_TRANSFER",
        momo: "MOMO",
        zalopay: "VNPAY",
        credit_card: "CREDIT_CARD",
        installment: "CREDIT_CARD",
      };
      const payload = {
        items: cart.items.map((i) => ({
          productId: i.productId,
          name: i.name,
          category: i.category,
          brand: i.brand,
          price: i.price,
          discountPrice: i.discountPrice,
          image: i.image,
          quantity: i.quantity,
        })),
        shippingAddress: address,
        paymentMethod: paymentMethodMap[paymentMethod],
        couponCode: couponDiscount > 0 ? couponCode : undefined,
        note: orderNote || undefined,
      };
      const response = await orderApi.createOrder(payload);
      const order = response?.data;
      await refreshCart();
      await refreshNotifications();

      // Handle non-COD payment flows via the payment step page.
      if (paymentMethod !== "cod") {
        router.push(`/checkout/mock-payment?orderId=${order.id}&method=${paymentMethod}&amount=${total}`);
        return;
      }

      router.push(`/account/orders/${order.id}`);
    } catch (error: any) {
      alert(error?.message || "Đặt hàng thất bại. Vui lòng thử lại!");
    } finally {
      setPlacing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container section">
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 480,
            gap: "1.5rem",
            textAlign: "center",
          }}>
            <div style={{
              width: 100, height: 100,
              borderRadius: "50%",
              background: "rgba(0,212,255,0.08)",
              border: "2px solid rgba(0,212,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "3rem",
              boxShadow: "0 0 40px rgba(0,212,255,0.15)",
            }}>🛒</div>
            <div>
              <h2 style={{
                fontSize: "1.8rem", fontWeight: 800,
                background: "linear-gradient(135deg, #00d4ff, #a855f7)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                margin: "0 0 0.5rem",
              }}>Giỏ hàng trống</h2>
              <p style={{ color: "var(--text-2)", margin: 0 }}>Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán.</p>
            </div>
            <Link href="/products" className="btn-primary" style={{ textDecoration: "none", padding: "0.85rem 2rem" }}>
              🛍️ Mua hàng ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "rgba(255,255,255,0.04)",
    color: "var(--text)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "0.4rem",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--text-2)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div className="checkout-page">
      {/* Sticky breadcrumb header */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(5,13,26,0.8)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div className="container" style={{ padding: "0.75rem 1.5rem" }}>
          <nav className="breadcrumb">
            <Link href="/" style={{ color: "var(--text-2)", textDecoration: "none", fontSize: "0.875rem" }}>Trang chủ</Link>
            <span className="breadcrumb__sep" style={{ color: "var(--text-2)", margin: "0 0.5rem" }}>›</span>
            <Link href="/cart" style={{ color: "var(--text-2)", textDecoration: "none", fontSize: "0.875rem" }}>Giỏ hàng</Link>
            <span className="breadcrumb__sep" style={{ color: "var(--text-2)", margin: "0 0.5rem" }}>›</span>
            <span style={{ color: "var(--cyan)", fontSize: "0.875rem", fontWeight: 600 }}>Thanh toán</span>
          </nav>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Page Title */}
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: 800,
              margin: 0,
              background: "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              💳 Thanh toán
            </h1>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "2rem",
            alignItems: "start",
          }}>
            {/* LEFT — Forms */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Shipping Address */}
              <div className="glass-card" style={{ padding: "1.75rem" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  marginBottom: "1.5rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <div style={{
                    width: 36, height: 36,
                    borderRadius: "10px",
                    background: "rgba(0,212,255,0.1)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem",
                  }}>📍</div>
                  <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text)" }}>
                    Thông tin giao hàng
                  </h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Họ và tên *</label>
                    <input
                      style={inputStyle}
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      required
                      onFocus={e => { e.target.style.borderColor = "rgba(0,212,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)"; }}
                      onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Số điện thoại *</label>
                    <input
                      style={inputStyle}
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="0912 345 678"
                      required
                      onFocus={e => { e.target.style.borderColor = "rgba(0,212,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)"; }}
                      onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    style={inputStyle}
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    placeholder="email@example.com"
                    onFocus={e => { e.target.style.borderColor = "rgba(0,212,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)"; }}
                    onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Tỉnh / Thành phố *</label>
                    <input
                      style={inputStyle}
                      value={address.province}
                      onChange={(e) => setAddress({ ...address, province: e.target.value })}
                      onBlur={calcShipping}
                      placeholder="Hồ Chí Minh"
                      required
                      onFocus={e => { e.target.style.borderColor = "rgba(0,212,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)"; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Quận / Huyện *</label>
                    <input
                      style={inputStyle}
                      value={address.district}
                      onChange={(e) => setAddress({ ...address, district: e.target.value })}
                      placeholder="Quận 1"
                      required
                      onFocus={e => { e.target.style.borderColor = "rgba(0,212,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)"; }}
                      onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phường / Xã</label>
                    <input
                      style={inputStyle}
                      value={address.ward}
                      onChange={(e) => setAddress({ ...address, ward: e.target.value })}
                      placeholder="Phường Bến Nghé"
                      onFocus={e => { e.target.style.borderColor = "rgba(0,212,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)"; }}
                      onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Địa chỉ chi tiết *</label>
                  <input
                    style={inputStyle}
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    placeholder="Số nhà, tên đường…"
                    required
                    onFocus={e => { e.target.style.borderColor = "rgba(0,212,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)"; }}
                    onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Ghi chú giao hàng</label>
                  <textarea
                    style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Giao giờ hành chính, gọi trước khi giao…"
                    rows={2}
                    onFocus={e => { e.target.style.borderColor = "rgba(0,212,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)"; }}
                    onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="glass-card" style={{ padding: "1.75rem" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  marginBottom: "1.5rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <div style={{
                    width: 36, height: 36,
                    borderRadius: "10px",
                    background: "rgba(168,85,247,0.1)",
                    border: "1px solid rgba(168,85,247,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem",
                  }}>💳</div>
                  <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text)" }}>
                    Phương thức thanh toán
                  </h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {PAYMENT_METHODS.map((pm) => (
                    <label
                      key={pm.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1rem 1.25rem",
                        borderRadius: "12px",
                        border: `1px solid ${paymentMethod === pm.value ? pm.color + "50" : "var(--border)"}`,
                        background: paymentMethod === pm.value ? `${pm.color}08` : "rgba(255,255,255,0.02)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        userSelect: "none",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={pm.value}
                        checked={paymentMethod === pm.value}
                        onChange={() => setPaymentMethod(pm.value)}
                        style={{ display: "none" }}
                      />
                      {/* Custom radio */}
                      <div style={{
                        width: 20, height: 20,
                        borderRadius: "50%",
                        border: `2px solid ${paymentMethod === pm.value ? pm.color : "var(--border)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                        transition: "border-color 0.2s",
                      }}>
                        {paymentMethod === pm.value && (
                          <div style={{
                            width: 10, height: 10,
                            borderRadius: "50%",
                            background: pm.color,
                          }} />
                        )}
                      </div>
                      <span style={{ fontSize: "1.3rem" }}>{pm.icon}</span>
                      <span style={{
                        fontWeight: paymentMethod === pm.value ? 700 : 500,
                        color: paymentMethod === pm.value ? "var(--text)" : "var(--text-2)",
                        fontSize: "0.9rem",
                        transition: "color 0.2s",
                      }}>
                        {pm.label}
                      </span>
                      {paymentMethod === pm.value && (
                        <span style={{
                          marginLeft: "auto",
                          fontSize: "0.75rem",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "999px",
                          background: `${pm.color}20`,
                          color: pm.color,
                          fontWeight: 700,
                        }}>
                          Đã chọn
                        </span>
                      )}
                    </label>
                  ))}
                </div>

                {paymentMethod === "bank_transfer" && (
                  <div style={{
                    marginTop: "1rem",
                    padding: "1rem 1.25rem",
                    borderRadius: "12px",
                    background: "rgba(59,130,246,0.06)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    fontSize: "0.875rem",
                    color: "var(--text-2)",
                    display: "flex", flexDirection: "column", gap: "0.35rem",
                  }}>
                    <p style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>📋 Thông tin chuyển khoản:</p>
                    <p style={{ margin: 0 }}>🏦 Ngân hàng: Vietcombank</p>
                    <p style={{ margin: 0 }}>📝 STK: 1234567890</p>
                    <p style={{ margin: 0 }}>👤 Chủ TK: CONG TY PC BUILDER SHOP</p>
                    <p style={{ margin: 0 }}>💡 Nội dung: [Mã đơn hàng] + [SĐT]</p>
                  </div>
                )}

                {paymentMethod === "cod" && subtotal > 20_000_000 && (
                  <div style={{
                    marginTop: "1rem",
                    padding: "0.875rem 1.25rem",
                    borderRadius: "12px",
                    background: "rgba(245,158,11,0.06)",
                    border: "1px solid rgba(245,158,11,0.25)",
                    color: "#f59e0b",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}>
                    ⚠️ COD chỉ áp dụng cho đơn dưới 20 triệu. Vui lòng chọn phương thức khác.
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Order Summary */}
            <div style={{ position: "sticky", top: 80 }}>
              <div className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Header */}
                <div style={{
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <h2 style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "var(--text)",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                  }}>
                    <span>🛍️</span>
                    Đơn hàng ({cart.totalItems} sản phẩm)
                  </h2>
                </div>

                {/* Items list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: 280, overflowY: "auto" }}>
                  {cart.items.map((item) => (
                    <div key={item.productId} style={{
                      display: "grid",
                      gridTemplateColumns: "48px 1fr auto",
                      gap: "0.75rem",
                      alignItems: "center",
                    }}>
                      <div style={{
                        width: 48, height: 48,
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid var(--border)",
                        position: "relative",
                        flexShrink: 0,
                      }}>
                        <img loading="lazy" decoding="async" src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <span style={{
                          position: "absolute",
                          top: -6, right: -6,
                          width: 20, height: 20,
                          borderRadius: "50%",
                          background: "var(--purple)",
                          color: "#fff",
                          fontSize: "0.65rem",
                          fontWeight: 800,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {item.quantity}
                        </span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          margin: 0,
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: "var(--text)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {item.name}
                        </p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-2)" }}>x{item.quantity}</p>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--cyan)", whiteSpace: "nowrap" }}>
                        {formatVND((item.discountPrice ?? item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div style={{
                  display: "flex",
                  gap: "0.5rem",
                  padding: "1rem",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border)",
                }}>
                  <input
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      padding: "0.6rem 0.875rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "rgba(255,255,255,0.04)",
                      color: "var(--text)",
                      fontSize: "0.85rem",
                      outline: "none",
                      fontFamily: "monospace",
                      letterSpacing: "0.05em",
                    }}
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="btn-secondary"
                    style={{ padding: "0.6rem 1rem", fontSize: "0.85rem", whiteSpace: "nowrap" }}
                  >
                    Áp dụng
                  </button>
                </div>
                {couponMsg && (
                  <p style={{
                    margin: "-0.75rem 0 0",
                    fontSize: "0.8rem",
                    color: couponDiscount > 0 ? "#10b981" : "#ef4444",
                    fontWeight: 600,
                    padding: "0.4rem 0.75rem",
                    borderRadius: "8px",
                    background: couponDiscount > 0 ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                  }}>
                    {couponDiscount > 0 ? "✅" : "❌"} {couponMsg}
                  </p>
                )}

                {/* Totals */}
                <div style={{
                  display: "flex", flexDirection: "column", gap: "0.6rem",
                  padding: "1rem",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--text-2)" }}>Tạm tính</span>
                    <span style={{ color: "var(--text)" }}>{formatVND(subtotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--text-2)" }}>Phí vận chuyển</span>
                    <span style={{ color: shippingFee > 0 ? "var(--text)" : "#10b981", fontWeight: shippingFee === 0 && address.province ? 700 : 400 }}>
                      {address.province ? (shippingFee > 0 ? formatVND(shippingFee) : "Miễn phí 🎉") : "Nhập địa chỉ"}
                    </span>
                  </div>
                  {couponDiscount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: "var(--text-2)" }}>Mã giảm giá ({couponCode})</span>
                      <span style={{ color: "#10b981", fontWeight: 700 }}>−{formatVND(couponDiscount)}</span>
                    </div>
                  )}
                  <div style={{ height: 1, background: "var(--border)", margin: "0.25rem 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text)", fontWeight: 700 }}>Tổng thanh toán</span>
                    <span style={{
                      fontWeight: 900,
                      fontSize: "1.25rem",
                      background: "linear-gradient(135deg, #00d4ff, #a855f7)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>
                      {formatVND(total)}
                    </span>
                  </div>
                </div>

                {/* Agree checkbox */}
                <label style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  cursor: "pointer",
                  userSelect: "none",
                }}>
                  <div style={{
                    width: 20, height: 20, minWidth: 20,
                    borderRadius: "6px",
                    border: `2px solid ${agreed ? "var(--cyan)" : "var(--border)"}`,
                    background: agreed ? "rgba(0,212,255,0.15)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                    marginTop: 2,
                  }}
                    onClick={() => setAgreed(!agreed)}
                  >
                    {agreed && <span style={{ color: "var(--cyan)", fontSize: "0.8rem", lineHeight: 1 }}>✓</span>}
                  </div>
                  <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} style={{ display: "none" }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-2)", lineHeight: 1.5 }}>
                    Tôi đồng ý với{" "}
                    <Link href="#" style={{ color: "var(--cyan)", textDecoration: "none" }}>điều khoản mua hàng</Link>
                    {" "}và{" "}
                    <Link href="#" style={{ color: "var(--cyan)", textDecoration: "none" }}>chính sách bảo hành</Link>
                  </span>
                </label>

                {/* Place Order Button */}
                <button
                  type="button"
                  className="btn-primary"
                  onClick={placeOrder}
                  disabled={placing || (paymentMethod === "cod" && subtotal > 20_000_000)}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    fontSize: "1rem",
                    fontWeight: 700,
                    opacity: (placing || (paymentMethod === "cod" && subtotal > 20_000_000)) ? 0.5 : 1,
                    cursor: (placing || (paymentMethod === "cod" && subtotal > 20_000_000)) ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  }}
                >
                  {placing ? (
                    <>
                      <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span>
                      Đang xử lý…
                    </>
                  ) : (
                    <>🚀 Đặt hàng — {formatVND(total)}</>
                  )}
                </button>
                {!agreed && (
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#f59e0b' }}>
                    Vui lòng tick vào ô đồng ý điều khoản bên trên để đặt hàng.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
