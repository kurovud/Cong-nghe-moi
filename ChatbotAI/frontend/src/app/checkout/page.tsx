"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import type { PaymentMethod, ShippingAddress } from "@/types/order.type";
import { orderApi } from "@/services/conference.api";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "₫";

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: "cod", label: "Thanh toán khi nhận hàng (COD)", icon: "💵" },
  { value: "bank_transfer", label: "Chuyển khoản ngân hàng", icon: "🏦" },
  { value: "momo", label: "Ví MoMo", icon: "📱" },
  { value: "zalopay", label: "VNPay", icon: "💳" },
  { value: "credit_card", label: "Thẻ tín dụng / ghi nợ", icon: "💳" },
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

      // Handle non-COD payment flows
      if (paymentMethod !== "cod") {
        // If backend returns a payment redirect URL (real provider), go there
        const paymentUrl = response?.data?.paymentUrl || response?.data?.payment?.redirectUrl;
        if (paymentUrl) {
          window.location.href = paymentUrl;
          return;
        }

        // Otherwise fall back to a mock payment simulator page for development/testing
        router.push(`/checkout/mock-payment?orderId=${order.id}&method=${paymentMethod}`);
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
          <div className="cart-empty">
            <h2>Giỏ hàng trống</h2>
            <p>Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán.</p>
            <Link href="/products" className="button hero__btn-primary">Mua hàng</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="breadcrumb__sep">/</span>
          <Link href="/cart">Giỏ hàng</Link>
          <span className="breadcrumb__sep">/</span>
          <span>Thanh toán</span>
        </nav>
      </div>

      <section className="section">
        <div className="container">
          <h1>Thanh toán</h1>

          <div className="checkout-layout">
            {/* Left — Forms */}
            <div className="checkout-forms">
              {/* Shipping Address */}
              <div className="checkout-section">
                <h2>Thông tin giao hàng</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Họ và tên *</label>
                    <input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tỉnh / Thành phố *</label>
                    <input value={address.province} onChange={(e) => setAddress({ ...address, province: e.target.value })} onBlur={calcShipping} placeholder="VD: Hồ Chí Minh" required />
                  </div>
                  <div className="form-group">
                    <label>Quận / Huyện *</label>
                    <input value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Phường / Xã</label>
                    <input value={address.ward} onChange={(e) => setAddress({ ...address, ward: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Địa chỉ chi tiết *</label>
                  <input value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} placeholder="Số nhà, tên đường…" required />
                </div>
                <div className="form-group">
                  <label>Ghi chú giao hàng</label>
                  <textarea value={orderNote} onChange={(e) => setOrderNote(e.target.value)} placeholder="Giao giờ hành chính, gọi trước khi giao…" rows={2} />
                </div>
              </div>

              {/* Payment */}
              <div className="checkout-section">
                <h2>Phương thức thanh toán</h2>
                <div className="payment-methods">
                  {PAYMENT_METHODS.map((pm) => (
                    <label key={pm.value} className={`payment-option ${paymentMethod === pm.value ? "payment-option--active" : ""}`}>
                      <input type="radio" name="payment" value={pm.value} checked={paymentMethod === pm.value} onChange={() => setPaymentMethod(pm.value)} />
                      <span className="payment-option__icon">{pm.icon}</span>
                      <span>{pm.label}</span>
                    </label>
                  ))}
                </div>
                {paymentMethod === "bank_transfer" && (
                  <div className="payment-info">
                    <p><strong>Thông tin chuyển khoản:</strong></p>
                    <p>🏦 Ngân hàng: Vietcombank</p>
                    <p>📝 STK: 1234567890</p>
                    <p>👤 Chủ TK: CONG TY PC BUILDER SHOP</p>
                    <p>💡 Nội dung: [Mã đơn hàng] + [SĐT]</p>
                  </div>
                )}
                {paymentMethod === "cod" && subtotal > 20_000_000 && (
                  <div className="payment-info payment-info--warn">
                    ⚠️ COD chỉ áp dụng cho đơn dưới 20 triệu. Vui lòng chọn phương thức khác.
                  </div>
                )}
              </div>
            </div>

            {/* Right — Summary */}
            <div className="checkout-summary">
              <h2>Đơn hàng ({cart.totalItems} sản phẩm)</h2>
              <div className="checkout-items">
                {cart.items.map((item) => (
                  <div key={item.productId} className="checkout-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p className="checkout-item__name">{item.name}</p>
                      <p className="checkout-item__qty">x{item.quantity}</p>
                    </div>
                    <span className="checkout-item__price">{formatVND((item.discountPrice ?? item.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="checkout-coupon">
                <input placeholder="Nhập mã giảm giá" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
                <button type="button" onClick={applyCoupon} className="button btn-sm">Áp dụng</button>
              </div>
              {couponMsg && <p className={`checkout-coupon__msg ${couponDiscount > 0 ? "checkout-coupon__msg--ok" : ""}`}>{couponMsg}</p>}

              {/* Totals */}
              <div className="checkout-totals">
                <div className="checkout-totals__row">
                  <span>Tạm tính</span>
                  <span>{formatVND(subtotal)}</span>
                </div>
                <div className="checkout-totals__row">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee > 0 ? formatVND(shippingFee) : "Nhập địa chỉ"}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="checkout-totals__row checkout-totals__row--discount">
                    <span>Mã giảm giá ({couponCode})</span>
                    <span>-{formatVND(couponDiscount)}</span>
                  </div>
                )}
                <div className="checkout-totals__row checkout-totals__row--total">
                  <span>Tổng thanh toán</span>
                  <span>{formatVND(total)}</span>
                </div>
              </div>

              <label className="checkout-agree">
                <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} />
                <span>Tôi đồng ý với <Link href="#">điều khoản mua hàng</Link> và <Link href="#">chính sách bảo hành</Link></span>
              </label>

              <button type="button" className="button auth-btn checkout-btn" onClick={placeOrder} disabled={placing || !agreed || (paymentMethod === "cod" && subtotal > 20_000_000)}>
                {placing ? "Đang xử lý…" : `Đặt hàng — ${formatVND(total)}`}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
