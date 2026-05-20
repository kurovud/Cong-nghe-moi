"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdminHeader from "@/components/AdminHeader";

const navSections = [
  {
    title: "Tổng quan",
    links: [
      { href: "/admin", label: "📊 Dashboard", desc: "Thống kê tổng quan" }
    ]
  },
  {
    title: "Quản lý sản phẩm",
    links: [
      { href: "/admin/products", label: "📦 Sản phẩm", desc: "Linh kiện, laptop, phụ kiện" },
      { href: "/admin/builds", label: "🖥️ PC Build sẵn", desc: "Bộ PC theo cấu hình" },
      { href: "/admin/services", label: "🛠️ Dịch vụ", desc: "Gói hỗ trợ & booking" }
    ]
  },
  {
    title: "Quản lý bán hàng",
    links: [
      { href: "/admin/orders", label: "🛒 Đơn hàng", desc: "Quản lý đơn hàng" }
    ]
  },
  {
    title: "Chatbot & Dữ liệu",
    links: [
      { href: "/admin/knowledge", label: "📚 Kho tri thức", desc: "Dữ liệu train chatbot" },
      { href: "/admin/faq", label: "❓ FAQ", desc: "Câu hỏi thường gặp" }
    ]
  },
  {
    title: "Hệ thống",
    links: [
      { href: "/admin/settings", label: "⚙️ Cấu hình", desc: "RAG & Routing" },
      { href: "/admin/users", label: "👥 Người dùng", desc: "Quản lý tài khoản" }
    ]
  }
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const devHost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const devForce = devHost && typeof window !== "undefined" && localStorage.getItem("DEV_FORCE_ADMIN") === "1";

  useEffect(() => {
    const devHost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const devForce = devHost && typeof window !== "undefined" && localStorage.getItem("DEV_FORCE_ADMIN") === "1";
    if (devForce) return; // allow developer to force admin UI without backend session

    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading && !devForce) {
    return <section className="admin-content">Đang tải...</section>;
  }

  const effectiveUser = user ?? (devForce ? {
    id: "dev-admin",
    email: "admin@pcbuildershop.dev",
    name: "Dev Admin",
    phone: "",
    avatar: "",
    role: "admin",
    addresses: [],
    createdAt: new Date().toISOString(),
  } : null as any);

  if (!effectiveUser) {
    return (
      <section className="admin-content">
        <div className="notice notice--info">Chuyển hướng tới trang đăng nhập…</div>
      </section>
    );
  }

  if (effectiveUser.role === "customer") {
    return (
      <section className="admin-content">
        <div className="notice notice--error">Bạn không có quyền truy cập khu vực quản trị.</div>
      </section>
    );
  }

  const isAdmin = effectiveUser.role === "admin";
  const visibleSections = navSections
    .map((section) => ({
      ...section,
      links: section.links.filter((link) => {
        if (!isAdmin && (link.href === "/admin/users" || link.href === "/admin/settings")) return false;
        return true;
      }),
    }))
    .filter((section) => section.links.length > 0);

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${collapsed ? "admin-sidebar--collapsed" : ""}`}>
        <div className="admin-sidebar__header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link href="/admin" className="admin-sidebar__logo">
              <span className="admin-sidebar__logo-icon">⚡</span>
              <div>
                <strong>PC Builder Admin</strong>
                <span className="admin-sidebar__logo-sub">{isAdmin ? "Quản trị hệ thống" : "Nhân viên"}</span>
              </div>
            </Link>
            <button type="button" className="btn btn--ghost" onClick={() => setCollapsed((c) => !c)} style={{ height: 34 }}>
              {collapsed ? "☰" : "⇤"}
            </button>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {visibleSections.map((section) => (
            <div key={section.title} className="admin-sidebar__section">
              <span className="admin-sidebar__section-title">{section.title}</span>
              {section.links.map((link) => (
                <Link key={link.href} href={link.href} className="admin-sidebar__link">
                  <span className="admin-sidebar__link-label">{link.label}</span>
                  <span className="admin-sidebar__link-desc">{link.desc}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <Link href="/" className="admin-sidebar__back">
            ← Về trang chủ
          </Link>
          <Link href="/chat" className="admin-sidebar__back">
            💬 Mở Chatbot
          </Link>
        </div>
      </aside>
      <section className="admin-content">
        <AdminHeader title="Quản trị hệ thống" />
        <div className="admin-content__body"><ErrorBoundary>{children}</ErrorBoundary></div>
      </section>
    </div>
  );
};

export default AdminLayout;
