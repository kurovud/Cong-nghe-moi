"use client";

import Link from "next/link";
import { useState } from "react";

const socialLinks = [
  { id: "FB", label: "Facebook", icon: "f", href: "#", color: "#1877F2" },
  { id: "YT", label: "YouTube", icon: "▶", href: "#", color: "#FF0000" },
  { id: "TK", label: "TikTok", icon: "♪", href: "#", color: "#010101" },
  { id: "IG", label: "Instagram", icon: "◉", href: "#", color: "#E1306C" },
  { id: "DC", label: "Discord", icon: "◈", href: "#", color: "#5865F2" },
];

const paymentMethods = [
  { id: "VISA", color: "#1A1F71" },
  { id: "MC", color: "#EB001B" },
  { id: "MOMO", color: "#A50064" },
  { id: "VNPAY", color: "#005BAA" },
  { id: "ZALOPAY", color: "#0068FF" },
];

const contactItems = [
  { icon: "📍", label: "123 Nguyễn Văn Cừ, Q.5, TP.HCM" },
  { icon: "📞", label: "Hotline: 1900 xxxx" },
  { icon: "✉️", label: "info@pcbuildershop.vn" },
  { icon: "🕐", label: "08:00 – 21:00 (T2 – CN)" },
  { icon: "💬", label: "Hỗ trợ online 24/7" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer style={{ background: "#030a16", borderTop: "1px solid var(--border)" }}>
      <div className="footer-newsletter">
        <div className="container">
          <div className="footer-newsletter__inner">
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 9999, padding: "0.25rem 0.75rem", fontSize: "0.72rem", fontWeight: 700, color: "var(--cyan)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                ✉️ Newsletter
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.2rem,3vw,1.6rem)", fontWeight: 800, color: "var(--text)", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "0.35rem" }}>
                NHẬN ƯU ĐÃI MỖI NGÀY
              </h3>
              <p style={{ color: "var(--text-2)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                Deal hot, sản phẩm mới và mã giảm giá độc quyền gửi thẳng về hộp thư.
              </p>
            </div>

            <div style={{ flexShrink: 0, width: "min(100%, 420px)" }}>
              {subscribed ? (
                <div style={{ padding: "1rem 1.5rem", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "var(--r)", color: "var(--green)", fontWeight: 600, textAlign: "center" }}>
                  🎉 Đăng ký thành công! Cảm ơn bạn.
                </div>
              ) : (
                <form onSubmit={handleSubscribe}>
                  <div className="footer-newsletter__input-wrap">
                    <input
                      type="email"
                      className="footer-newsletter__input"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      style={{
                        flexShrink: 0,
                        padding: "0.8rem 1.4rem",
                        background: "var(--grad-brand)",
                        border: "none",
                        borderRadius: "var(--r)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontFamily: "inherit",
                        boxShadow: "0 4px 16px rgba(0,212,255,0.3)",
                        transition: "all 0.2s",
                      }}
                    >
                      Đăng ký →
                    </button>
                  </div>
                  <p style={{ marginTop: "0.6rem", fontSize: "0.75rem", color: "var(--text-3)" }}>
                    🔒 Không spam &nbsp;•&nbsp; Hủy bất cứ lúc &nbsp;•&nbsp; Privacy protected
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "3.5rem 0 2rem" }}>
        <div className="footer-main-grid">
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none", marginBottom: "1rem" }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: "var(--grad-brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 800, color: "#fff", boxShadow: "0 0 20px rgba(0,212,255,0.35)", flexShrink: 0 }}>PB</div>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", fontWeight: 800, color: "var(--text)", lineHeight: 1.15 }}>PC Builder Shop</div>
                <div style={{ fontSize: "0.62rem", color: "var(--text-3)", fontWeight: 500, letterSpacing: "0.04em" }}>Linh kiện chính hãng</div>
              </div>
            </Link>

            <p style={{ color: "var(--text-2)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              Chuyên cung cấp linh kiện PC, laptop gaming và bộ PC build sẵn. Chatbot AI tư vấn cấu hình 24/7 hoàn toàn miễn phí.
            </p>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  title={social.label}
                  style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-2)", transition: "all 0.2s", textDecoration: "none" }}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div style={{ padding: "0.85rem 1rem", background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: "var(--r)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ fontSize: "1.3rem" }}>📞</div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Hotline miễn phí</div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, color: "var(--cyan)", letterSpacing: "0.02em" }}>1900 xxxx</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="footer-col__title">Sản phẩm</h4>
            <ul className="footer-col__links">
              <li><Link href="/products?category=cpu">CPU</Link></li>
              <li><Link href="/products?category=gpu">GPU / VGA</Link></li>
              <li><Link href="/products?category=ram">RAM</Link></li>
              <li><Link href="/products?category=ssd">SSD / HDD</Link></li>
              <li><Link href="/products?category=mainboard">Mainboard</Link></li>
              <li><Link href="/products?category=case">Case & PSU</Link></li>
              <li><Link href="/products?category=laptop">Laptop Gaming</Link></li>
              <li><Link href="/builds">PC Build sẵn</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col__title">Dịch vụ</h4>
            <ul className="footer-col__links">
              <li><Link href="/services">Lắp ráp PC</Link></li>
              <li><Link href="/services">Lắp đặt tại nhà</Link></li>
              <li><Link href="/services">Bảo hành</Link></li>
              <li><Link href="/chat">Tư vấn AI 24/7</Link></li>
              <li><Link href="/services">Thu cũ đổi mới</Link></li>
              <li><Link href="/services">Nâng cấp PC</Link></li>
              <li><Link href="/services">Vệ sinh máy tính</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col__title">Hỗ trợ</h4>
            <ul className="footer-col__links">
              <li><Link href="#">FAQ</Link></li>
              <li><Link href="#">So sánh giá</Link></li>
              <li><Link href="#">Thương hiệu</Link></li>
              <li><Link href="#">Blog & Review</Link></li>
              <li><Link href="#">Showroom</Link></li>
              <li><Link href="#">Chính sách đổi trả</Link></li>
              <li><Link href="#">Hướng dẫn mua hàng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col__title">Liên hệ</h4>
            <ul className="footer-contact-list">
              {contactItems.map((item) => (
                <li key={item.label}>
                  <span style={{ fontSize: "0.95rem", flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.85rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 9999 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 6px var(--green)", flexShrink: 0, display: "inline-block" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--green)", fontWeight: 600 }}>Đang trực tuyến</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-3)" }}>
              © 2025 PC Builder Shop. All rights reserved. &nbsp;|&nbsp; Powered by <span style={{ background: "var(--grad-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontWeight: 700 }}>AI Chatbot</span>
            </span>
            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
              {["Chính sách bảo mật", "Điều khoản dịch vụ", "Chính sách Cookie"].map((text) => (
                <a key={text} href="#" style={{ color: "var(--text-3)", fontSize: "0.78rem", transition: "color 0.2s", textDecoration: "none" }}>
                  {text}
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.35rem 0.75rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--r-sm)", fontSize: "0.7rem", color: "var(--text-3)", fontWeight: 600 }}>
              🏛️ Đã đăng ký BCT
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
              {paymentMethods.map((paymentMethod) => (
                <div
                  key={paymentMethod.id}
                  className="footer-payment-icon"
                  style={{ background: `${paymentMethod.color}18`, borderColor: `${paymentMethod.color}30`, color: paymentMethod.color }}
                >
                  {paymentMethod.id}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .footer-main-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }
        @media (max-width: 700px) {
          .footer-main-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-newsletter__inner { flex-direction: column; }
        }
        @media (max-width: 520px) {
          .footer-main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
