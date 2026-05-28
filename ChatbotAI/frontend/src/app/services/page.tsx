"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  DEFAULT_SERVICES,
  loadServiceCatalog,
  saveServiceCatalog,
  type ServiceCatalogItem,
} from "@/lib/serviceCatalog";

const bookingStorageKey = "service-bookings";

export default function ServicesPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<"all" | ServiceCatalogItem["category"]>("all");
  const [services, setServices] = useState<ServiceCatalogItem[]>(DEFAULT_SERVICES);
  const [selectedService, setSelectedService] = useState<ServiceCatalogItem | null>(null);
  const [bookingData, setBookingData] = useState({ name: "", phone: "", email: "", date: "", notes: "" });
  const [bookings, setBookings] = useState<Array<{ id: string; serviceName: string; name: string; phone: string; email: string; date: string; notes: string; status: string; createdAt: string }>>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/services");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setServices(data as ServiceCatalogItem[]);
            return;
          }
          if (Array.isArray((data as any).services)) {
            setServices((data as any).services as ServiceCatalogItem[]);
            return;
          }
        }
      } catch {
        // fallback
      }
      setServices(loadServiceCatalog());
    })();
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(bookingStorageKey);
      if (saved) setBookings(JSON.parse(saved));
    } catch {
      setBookings([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(bookingStorageKey, JSON.stringify(bookings));
    } catch {
      // ignore persistence issues
    }
  }, [bookings]);

  useEffect(() => {
    saveServiceCatalog(services);
  }, [services]);

  const categories = [
    { id: "all", label: "Tất Cả Dịch Vụ" },
    { id: "assembly", label: "🔧 Lắp Ráp" },
    { id: "delivery", label: "🚚 Vận Chuyển" },
    { id: "support", label: "🛡️ Hỗ Trợ" },
    { id: "consultation", label: "💡 Tư Vấn" },
  ] as const;

  const filteredServices = useMemo(
    () => (selectedCategory === "all" ? services : services.filter((service) => service.category === selectedCategory)),
    [selectedCategory, services]
  );

  const recentBookings = bookings.slice(0, 4);

  const openBooking = (service: ServiceCatalogItem) => {
    setSelectedService(service);
    setBookingData({ name: "", phone: "", email: "", date: "", notes: "" });
    setMessage("");
  };

  const submitBooking = () => {
    if (!selectedService || !bookingData.name || !bookingData.phone || !bookingData.email || !bookingData.date) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const nextBooking = {
      id: `booking-${Date.now()}`,
      serviceName: selectedService.name,
      name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email,
      date: bookingData.date,
      notes: bookingData.notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setBookings((current) => [nextBooking, ...current]);
    setMessage(`Đã lưu yêu cầu cho ${selectedService.name}.`);
    alert(`Đã đặt dịch vụ "${selectedService.name}" thành công! Chúng tôi sẽ liên hệ với bạn sớm.`);
    setSelectedService(null);
    setBookingData({ name: "", phone: "", email: "", date: "", notes: "" });
  };

  /* ---- shared inline‑style helpers ---- */
  const inputStyle: React.CSSProperties = {
    padding: "0.85rem 1rem",
    borderRadius: "var(--r)",
    border: "1px solid var(--border-2)",
    background: "var(--surface)",
    color: "var(--text)",
    fontSize: "0.95rem",
    fontFamily: "var(--font)",
    outline: "none",
    transition: "border-color 0.25s var(--ease), box-shadow 0.25s var(--ease)",
    width: "100%",
  };

  const categoryIconMap: Record<string, string> = {
    assembly: "🔧",
    delivery: "🚚",
    support: "🛡️",
    consultation: "💡",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* ===== BREADCRUMB ===== */}
      <div className="container" style={{ paddingTop: "1.25rem" }}>
        <nav className="breadcrumb">
          <Link href="/">Trang Chủ</Link>
          <span>/</span>
          <span style={{ color: "var(--cyan)" }}>Dịch Vụ</span>
        </nav>
      </div>

      {/* ===== HERO SECTION ===== */}
      <section
        style={{
          position: "relative",
          padding: "3.5rem 0 3rem",
          overflow: "hidden",
        }}
      >
        {/* hero glow */}
        <div style={{
          position: "absolute", top: "-40%", left: "-10%", width: "55%", height: "120%",
          background: "radial-gradient(ellipse at center, rgba(0,212,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-30%", right: "-5%", width: "45%", height: "100%",
          background: "radial-gradient(ellipse at center, rgba(168,85,247,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gap: "1rem", maxWidth: 780 }}>
            <span
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                width: "fit-content", padding: "0.45rem 1rem", borderRadius: 999,
                background: "linear-gradient(135deg, rgba(0,212,255,0.12), rgba(168,85,247,0.12))",
                border: "1px solid var(--border-2)",
                color: "var(--cyan)", fontWeight: 700, fontSize: "0.82rem",
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}
            >
              🛠️ DỊCH VỤ HỖ TRỢ
            </span>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              <span className="gradient-text">Đặt dịch vụ nhanh,</span>{" "}
              <span style={{ color: "var(--text)" }}>rõ ràng và đồng bộ</span>
            </h1>

            <p style={{ color: "var(--text-2)", fontSize: "1.08rem", margin: 0, maxWidth: 600, lineHeight: 1.6 }}>
              Tập trung vào trải nghiệm đặt lịch, theo dõi yêu cầu và chuyển phần quản trị sang khu vực admin.
            </p>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              <div
                style={{
                  padding: "0.6rem 1.15rem", borderRadius: 999,
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  color: "var(--text)", fontWeight: 600, fontSize: "0.9rem",
                  display: "flex", alignItems: "center", gap: "0.45rem",
                }}
              >
                <span style={{ color: "var(--cyan)", fontWeight: 800 }}>{services.length}</span> dịch vụ đang mở
              </div>
              {user?.role === "admin" && (
                <Link
                  href="/admin/services"
                  className="btn-primary btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  ⚙️ Mở trang quản trị
                </Link>
              )}
            </div>

            {message && (
              <div
                style={{
                  padding: "0.75rem 1.1rem", borderRadius: "var(--r)",
                  background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
                  color: "var(--green)", fontWeight: 600, width: "fit-content",
                  display: "flex", alignItems: "center", gap: "0.45rem",
                }}
              >
                ✅ {message}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== CATEGORY FILTERS + SERVICE CARDS ===== */}
      <section style={{ padding: "0 0 3rem" }}>
        <div className="container">
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {/* filters row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}>
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    style={{
                      padding: "0.55rem 1.1rem",
                      borderRadius: 999,
                      border: selectedCategory === category.id ? "1px solid var(--cyan)" : "1px solid var(--border)",
                      background: selectedCategory === category.id
                        ? "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(168,85,247,0.10))"
                        : "var(--surface)",
                      color: selectedCategory === category.id ? "var(--cyan)" : "var(--text-2)",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.25s var(--ease)",
                      fontSize: "0.88rem",
                    }}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              <div
                style={{
                  padding: "0.55rem 1rem", borderRadius: 999,
                  background: "var(--surface)", border: "1px solid var(--border)",
                  color: "var(--text-3)", fontWeight: 500, fontSize: "0.85rem",
                }}
              >
                📅 Đặt lịch và theo dõi ngay trên trang này
              </div>
            </div>

            {/* service cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
              {filteredServices.map((service) => (
                <article
                  key={service.id}
                  className="glass-card"
                  style={{
                    display: "grid", gap: "1rem", padding: "1.5rem",
                    borderRadius: "var(--r-lg)",
                    transition: "transform 0.3s var(--ease), box-shadow 0.3s var(--ease), border-color 0.3s var(--ease)",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-cyan)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  }}
                >
                  {/* header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div>
                      <div
                        style={{
                          width: 48, height: 48, borderRadius: "var(--r-sm)",
                          background: "linear-gradient(135deg, rgba(0,212,255,0.1), rgba(168,85,247,0.1))",
                          border: "1px solid var(--border)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "1.5rem", marginBottom: "0.6rem",
                        }}
                      >
                        {service.icon}
                      </div>
                      <h3 style={{ margin: 0, color: "var(--text)", fontWeight: 700, fontSize: "1.05rem", fontFamily: "var(--font-heading)" }}>
                        {service.name}
                      </h3>
                      <p style={{ margin: "0.2rem 0 0", color: "var(--text-3)", fontSize: "0.82rem" }}>
                        {service.duration || "Thời gian linh hoạt"}
                      </p>
                    </div>
                    <span
                      className={service.inStock ? "badge--success" : "badge--danger"}
                      style={{
                        padding: "0.35rem 0.7rem", borderRadius: 999,
                        fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap",
                      }}
                    >
                      {service.inStock ? "✓ Còn nhận lịch" : "✕ Tạm ngưng"}
                    </span>
                  </div>

                  {/* description */}
                  <p style={{ margin: 0, color: "var(--text-2)", lineHeight: 1.6, fontSize: "0.92rem" }}>
                    {service.description}
                  </p>

                  {/* features */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {service.features.slice(0, 4).map((feature) => (
                      <span
                        key={feature}
                        style={{
                          padding: "0.3rem 0.65rem", borderRadius: 999,
                          background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)",
                          color: "var(--cyan)", fontSize: "0.76rem", fontWeight: 600,
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* price + CTA */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", marginTop: "auto" }}>
                    <strong
                      className="gradient-text"
                      style={{ fontSize: "1.15rem", fontFamily: "var(--font-heading)" }}
                    >
                      {service.price === 0 ? "Miễn phí" : `${new Intl.NumberFormat("vi-VN").format(service.price)}₫`}
                    </strong>
                    <button
                      type="button"
                      onClick={() => openBooking(service)}
                      className="btn-primary btn-sm"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "0.4rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      📅 Đặt ngay
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div style={{
                textAlign: "center", padding: "3rem 1rem", color: "var(--text-3)",
                background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)",
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</div>
                <p style={{ margin: 0, fontWeight: 600, color: "var(--text-2)" }}>Không tìm thấy dịch vụ nào</p>
                <p style={{ margin: "0.35rem 0 0", fontSize: "0.88rem" }}>Hãy thử chọn danh mục khác.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== RECENT BOOKINGS + TRUST BADGES ===== */}
      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem" }}>
            {/* recent bookings */}
            <div
              className="glass-card"
              style={{ padding: "1.5rem", borderRadius: "var(--r-xl)" }}
            >
              <h2 style={{ marginTop: 0, color: "var(--text)", fontFamily: "var(--font-heading)", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                🗓️ <span className="gradient-text">Yêu cầu gần đây</span>
              </h2>
              {recentBookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--text-3)" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📋</div>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>Chưa có yêu cầu nào được lưu.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      style={{
                        background: "var(--surface-2)", border: "1px solid var(--border)",
                        borderRadius: "var(--r)", padding: "1rem",
                        transition: "border-color 0.2s var(--ease)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "0.4rem" }}>
                        <strong style={{ color: "var(--text)", fontSize: "0.92rem" }}>{booking.serviceName}</strong>
                        <span className="badge--warning" style={{ padding: "0.25rem 0.6rem", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700 }}>
                          ⏳ Đang chờ
                        </span>
                      </div>
                      <p style={{ margin: 0, color: "var(--text-2)", fontSize: "0.85rem" }}>
                        {booking.name} • {booking.phone}
                      </p>
                      <p style={{ margin: "0.2rem 0 0", color: "var(--text-3)", fontSize: "0.82rem" }}>
                        📅 Hẹn ngày: {new Date(booking.date).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* trust badges */}
            <div
              className="glass-card"
              style={{ padding: "1.5rem", borderRadius: "var(--r-xl)" }}
            >
              <h2 style={{ marginTop: 0, color: "var(--text)", fontFamily: "var(--font-heading)", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                ✨ <span className="gradient-text">Cam kết dịch vụ</span>
              </h2>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {[
                  { icon: "🛡️", title: "Bảo hành chính hãng", desc: "Linh kiện bảo hành theo chính sách nhà sản xuất" },
                  { icon: "🔄", title: "Đồng bộ hệ thống", desc: "Dữ liệu dịch vụ chia sẻ với khu admin, thay đổi đồng bộ" },
                  { icon: "📱", title: "Hỗ trợ 24/7", desc: "Đội ngũ kỹ thuật viên luôn sẵn sàng hỗ trợ" },
                  { icon: "⚡", title: "Xử lý nhanh chóng", desc: "Booking lưu lại trình duyệt, xem nhanh yêu cầu gần đây" },
                ].map((badge) => (
                  <div
                    key={badge.title}
                    style={{
                      display: "flex", gap: "0.85rem", alignItems: "flex-start",
                      padding: "0.85rem", borderRadius: "var(--r)",
                      background: "var(--surface-2)", border: "1px solid var(--border)",
                      transition: "border-color 0.2s var(--ease)",
                    }}
                  >
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: "var(--r-sm)",
                        background: "linear-gradient(135deg, rgba(0,212,255,0.1), rgba(168,85,247,0.1))",
                        border: "1px solid var(--border)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.15rem", flexShrink: 0,
                      }}
                    >
                      {badge.icon}
                    </div>
                    <div>
                      <strong style={{ color: "var(--text)", fontSize: "0.9rem" }}>{badge.title}</strong>
                      <p style={{ margin: "0.15rem 0 0", color: "var(--text-3)", fontSize: "0.82rem", lineHeight: 1.5 }}>
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {user?.role === "admin" && (
                <div style={{ marginTop: "1rem", padding: "0.7rem 1rem", borderRadius: "var(--r)", background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.18)", fontSize: "0.85rem", color: "var(--purple)" }}>
                  💡 Quản trị viên có thể truy cập <Link href="/admin/services" style={{ color: "var(--cyan)", textDecoration: "underline" }}>/admin/services</Link> để quản lý.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOOKING MODAL ===== */}
      {selectedService && (
        <div
          style={{
            position: "fixed", inset: 0,
            background: "rgba(5,13,26,0.75)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: "1rem",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedService(null); }}
        >
          <div
            style={{
              width: "min(560px, 100%)",
              borderRadius: "var(--r-2xl)",
              padding: "1.75rem",
              background: "linear-gradient(145deg, rgba(15,23,42,0.97), rgba(5,13,26,0.98))",
              border: "1px solid var(--border-2)",
              boxShadow: "var(--shadow-lg), 0 0 80px rgba(0,212,255,0.06)",
              maxHeight: "90vh", overflowY: "auto",
            }}
          >
            {/* modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <div>
                <p style={{ margin: 0, color: "var(--text-3)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                  Đặt Dịch Vụ
                </p>
                <h2 style={{ margin: "0.25rem 0 0", color: "var(--text)", fontFamily: "var(--font-heading)", fontSize: "1.3rem" }}>
                  {selectedService.name}
                </h2>
                <p className="gradient-text" style={{ margin: "0.35rem 0 0", fontWeight: 700, fontSize: "1.1rem" }}>
                  {selectedService.price === 0 ? "Miễn phí" : `${new Intl.NumberFormat("vi-VN").format(selectedService.price)}₫`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                style={{
                  width: 36, height: 36, borderRadius: "var(--r-sm)",
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  color: "var(--text-3)", fontSize: "1.1rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s var(--ease)",
                }}
              >
                ✕
              </button>
            </div>

            {/* booking form */}
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div className="form-group">
                <label style={{ color: "var(--text-2)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.3rem", display: "block" }}>
                  Họ và tên *
                </label>
                <input
                  placeholder="Nguyễn Văn A"
                  value={bookingData.name}
                  onChange={(event) => setBookingData((current) => ({ ...current, name: event.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                <div className="form-group">
                  <label style={{ color: "var(--text-2)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.3rem", display: "block" }}>
                    Số điện thoại *
                  </label>
                  <input
                    placeholder="0912 345 678"
                    value={bookingData.phone}
                    onChange={(event) => setBookingData((current) => ({ ...current, phone: event.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div className="form-group">
                  <label style={{ color: "var(--text-2)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.3rem", display: "block" }}>
                    Email *
                  </label>
                  <input
                    placeholder="email@example.com"
                    value={bookingData.email}
                    onChange={(event) => setBookingData((current) => ({ ...current, email: event.target.value }))}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div className="form-group">
                <label style={{ color: "var(--text-2)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.3rem", display: "block" }}>
                  Ngày hẹn *
                </label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(event) => setBookingData((current) => ({ ...current, date: event.target.value }))}
                  style={{ ...inputStyle, colorScheme: "dark" }}
                />
              </div>
              <div className="form-group">
                <label style={{ color: "var(--text-2)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.3rem", display: "block" }}>
                  Ghi chú
                </label>
                <textarea
                  placeholder="Mô tả yêu cầu hoặc ghi chú thêm..."
                  value={bookingData.notes}
                  onChange={(event) => setBookingData((current) => ({ ...current, notes: event.target.value }))}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" as any }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.35rem" }}>
                <button
                  type="button"
                  onClick={submitBooking}
                  className="btn-primary"
                  style={{ flex: 1, minWidth: 180, padding: "0.85rem 1.5rem", fontSize: "0.95rem" }}
                >
                  ✅ Xác Nhận Đặt Hàng
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="btn-ghost"
                  style={{ flex: 1, minWidth: 180, padding: "0.85rem 1.5rem", fontSize: "0.95rem" }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
