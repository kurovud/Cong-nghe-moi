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

  return (
    <div className="services-storefront">
      <section className="products-hero" style={{ background: "linear-gradient(135deg, #f0d1e0 0%, #e8e0f0 100%)" }}>
        <div className="container">
          <div style={{ display: "grid", gap: "0.65rem", maxWidth: 760 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", width: "fit-content", padding: "0.42rem 0.8rem", borderRadius: 999, background: "rgba(255,255,255,0.72)", color: "#162033", fontWeight: 800, border: "1px solid rgba(255,143,31,0.12)" }}>
              🛠️ DỊCH VỤ HỖ TRỢ
            </span>
            <h1 style={{ color: "#162033", margin: 0 }}>Đặt dịch vụ nhanh, rõ ràng và đồng bộ với hệ thống</h1>
            <p style={{ color: "#4a5568", fontSize: "1.05rem", margin: 0 }}>
              Tập trung vào trải nghiệm đặt lịch, theo dõi yêu cầu và chuyển phần quản trị sang khu vực admin.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
              <div style={{ padding: "0.7rem 1rem", borderRadius: 999, background: "rgba(255,255,255,0.72)", border: "1px solid rgba(255,143,31,0.12)", color: "#162033", fontWeight: 700 }}>
                {services.length} dịch vụ đang mở
              </div>
              {user?.role === "admin" && (
                <Link href="/admin/services" className="button btn-sm">
                  ⚙️ Mở trang quản trị
                </Link>
              )}
            </div>
            {message && (
              <div style={{ padding: "0.8rem 1rem", borderRadius: 16, background: "rgba(255,255,255,0.72)", border: "1px solid rgba(255,143,31,0.12)", color: "#162033", fontWeight: 700, width: "fit-content" }}>
                {message}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="products-layout">
        <div className="container">
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
                {categories.map((category) => (
                  <button type="button"
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    style={{
                      padding: "0.55rem 1rem",
                      borderRadius: 999,
                      border: "1px solid rgba(255,143,31,0.12)",
                      background: selectedCategory === category.id ? "linear-gradient(135deg, #ffb3c1, #ff9f7a)" : "rgba(255,250,252,0.92)",
                      color: "#162033",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              <div style={{ padding: "0.7rem 1rem", borderRadius: 999, background: "rgba(255,255,255,0.72)", border: "1px solid rgba(255,143,31,0.12)", color: "#162033", fontWeight: 700 }}>
                Đặt lịch và theo dõi ngay trên trang này
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {filteredServices.map((service) => (
                <article key={service.id} className="service-card" style={{ display: "grid", gap: "0.9rem", padding: "1.3rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div>
                      <div style={{ fontSize: "2rem", lineHeight: 1 }}>{service.icon}</div>
                      <h3 className="service-title" style={{ marginTop: "0.45rem" }}>{service.name}</h3>
                      <p style={{ margin: 0, color: "#7c8fa6", fontSize: "0.85rem" }}>{service.duration || "Thời gian linh hoạt"}</p>
                    </div>
                    <span style={{ padding: "0.4rem 0.75rem", borderRadius: 999, background: service.inStock ? "rgba(255,179,193,0.18)" : "rgba(215,166,255,0.18)", color: "#162033", fontWeight: 700, fontSize: "0.78rem" }}>
                      {service.inStock ? "Còn nhận lịch" : "Tạm ngưng"}
                    </span>
                  </div>

                  <p style={{ margin: 0, color: "#4a5568", lineHeight: 1.55 }}>{service.description}</p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                    {service.features.slice(0, 4).map((feature) => (
                      <span key={feature} className="badge badge--blue">{feature}</span>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
                    <strong style={{ color: "#162033", fontSize: "1.1rem" }}>
                      {service.price === 0 ? "Miễn phí" : `${new Intl.NumberFormat("vi-VN").format(service.price)}₫`}
                    </strong>
                    <button type="button"
                      onClick={() => openBooking(service)}
                      style={{
                        padding: "0.65rem 1rem",
                        borderRadius: 12,
                        border: "none",
                        background: "linear-gradient(135deg, #ffb3c1, #ff9f7a)",
                        color: "#162033",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      📅 Đặt ngay
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "1rem" }}>
            <div style={{ background: "linear-gradient(135deg, rgba(255,250,252,0.96), rgba(247,251,255,0.97))", border: "1px solid rgba(255,143,31,0.12)", borderRadius: "22px", padding: "1.3rem" }}>
              <h2 style={{ marginTop: 0, color: "#162033" }}>🗓️ Yêu cầu gần đây</h2>
              {recentBookings.length === 0 ? (
                <p style={{ color: "#7c8fa6" }}>Chưa có yêu cầu nào được lưu.</p>
              ) : (
                <div style={{ display: "grid", gap: "0.85rem" }}>
                  {recentBookings.map((booking) => (
                    <div key={booking.id} style={{ background: "rgba(255,255,255,0.74)", border: "1px solid rgba(255,143,31,0.10)", borderRadius: 16, padding: "0.95rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "0.35rem" }}>
                        <strong style={{ color: "#162033" }}>{booking.serviceName}</strong>
                        <span style={{ color: "#ff6b9d", fontWeight: 700 }}>Đang chờ</span>
                      </div>
                      <p style={{ margin: 0, color: "#4a5568" }}>{booking.name} • {booking.phone}</p>
                      <p style={{ margin: "0.25rem 0 0", color: "#7c8fa6" }}>Hẹn ngày: {new Date(booking.date).toLocaleDateString("vi-VN")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: "linear-gradient(135deg, rgba(255,250,252,0.96), rgba(247,251,255,0.97))", border: "1px solid rgba(255,143,31,0.12)", borderRadius: "22px", padding: "1.3rem" }}>
              <h2 style={{ marginTop: 0, color: "#162033" }}>✨ Vì sao dễ dùng hơn</h2>
              <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#4a5568", display: "grid", gap: "0.5rem", lineHeight: 1.55 }}>
                <li>Giao diện chỉ còn luồng đặt lịch cho khách, không lẫn chức năng quản trị.</li>
                <li>Dữ liệu dịch vụ được chia sẻ với khu admin nên thay đổi sẽ đồng bộ.</li>
                <li>Booking lưu lại trong trình duyệt để xem nhanh các yêu cầu gần đây.</li>
                <li>Có liên kết sang <strong>/admin/services</strong> cho tài khoản quản trị.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {selectedService && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ width: "min(560px, 100%)", borderRadius: 24, padding: "1.4rem", background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(247,251,255,0.98))", border: "1px solid rgba(255,143,31,0.12)", boxShadow: "0 24px 64px rgba(18, 32, 51, 0.18)" }}>
            <h2 style={{ marginTop: 0, color: "#162033" }}>Đặt Dịch Vụ: {selectedService.name}</h2>
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <input placeholder="Họ và tên" value={bookingData.name} onChange={(event) => setBookingData((current) => ({ ...current, name: event.target.value }))} style={{ padding: "0.8rem", borderRadius: 12, border: "1px solid rgba(255,143,31,0.18)" }} />
              <input placeholder="Số điện thoại" value={bookingData.phone} onChange={(event) => setBookingData((current) => ({ ...current, phone: event.target.value }))} style={{ padding: "0.8rem", borderRadius: 12, border: "1px solid rgba(255,143,31,0.18)" }} />
              <input placeholder="Email" value={bookingData.email} onChange={(event) => setBookingData((current) => ({ ...current, email: event.target.value }))} style={{ padding: "0.8rem", borderRadius: 12, border: "1px solid rgba(255,143,31,0.18)" }} />
              <input type="date" value={bookingData.date} onChange={(event) => setBookingData((current) => ({ ...current, date: event.target.value }))} style={{ padding: "0.8rem", borderRadius: 12, border: "1px solid rgba(255,143,31,0.18)" }} />
              <textarea placeholder="Ghi chú (tuỳ chọn)" value={bookingData.notes} onChange={(event) => setBookingData((current) => ({ ...current, notes: event.target.value }))} rows={4} style={{ padding: "0.8rem", borderRadius: 12, border: "1px solid rgba(255,143,31,0.18)" }} />
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button type="button" onClick={submitBooking} className="button" style={{ flex: 1, minWidth: 180 }}>Xác Nhận Đặt Hàng</button>
                <button type="button" onClick={() => setSelectedService(null)} className="button btn-sm" style={{ flex: 1, minWidth: 180 }}>Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
