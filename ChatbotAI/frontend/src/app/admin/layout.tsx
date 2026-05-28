"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdminHeader from "@/components/AdminHeader";

const navSections = [
  {
    title: "Tổng quan",
    links: [
      { href: "/admin", label: "Dashboard", icon: "📊", desc: "Thống kê tổng quan" }
    ]
  },
  {
    title: "Quản lý sản phẩm",
    links: [
      { href: "/admin/products", label: "Sản phẩm", icon: "📦", desc: "Linh kiện, laptop, phụ kiện" },
      { href: "/admin/builds", label: "PC Build sẵn", icon: "🖥️", desc: "Bộ PC theo cấu hình" },
      { href: "/admin/services", label: "Dịch vụ", icon: "🛠️", desc: "Gói hỗ trợ & booking" }
    ]
  },
  {
    title: "Quản lý bán hàng",
    links: [
      { href: "/admin/orders", label: "Đơn hàng", icon: "🛒", desc: "Quản lý đơn hàng" }
    ]
  },
  {
    title: "Chatbot & Dữ liệu",
    links: [
      { href: "/admin/live-chats", label: "Live chat", icon: "💬", desc: "Hỗ trợ khách hàng trực tiếp" },
      { href: "/admin/knowledge", label: "Kho tri thức", icon: "📚", desc: "Dữ liệu train chatbot" },
      { href: "/admin/faq", label: "FAQ", icon: "❓", desc: "Câu hỏi thường gặp" }
    ]
  },
  {
    title: "Hệ thống",
    links: [
      { href: "/admin/settings", label: "Cấu hình", icon: "⚙️", desc: "RAG & Routing" },
      { href: "/admin/users", label: "Người dùng", icon: "👥", desc: "Quản lý tài khoản" }
    ]
  }
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
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
    return (
      <section className="admin-content">
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "1rem",
          color: "var(--text-2)"
        }}>
          <div style={{
            width: 40,
            height: 40,
            border: "3px solid var(--border)",
            borderTop: "3px solid var(--cyan)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <span>Đang tải...</span>
        </div>
      </section>
    );
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

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="admin-layout">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes sidebarGlow {
          0%, 100% { box-shadow: inset -1px 0 0 rgba(0,212,255,0.15); }
          50% { box-shadow: inset -1px 0 0 rgba(0,212,255,0.35); }
        }
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg);
        }
        .admin-sidebar {
          width: 260px;
          min-height: 100vh;
          background: linear-gradient(180deg, rgba(0,10,30,0.98) 0%, rgba(5,13,26,0.98) 100%);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          flex-shrink: 0;
          animation: sidebarGlow 4s ease-in-out infinite;
        }
        .admin-sidebar--collapsed {
          width: 68px;
        }
        .admin-sidebar__header {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .admin-sidebar__header-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }
        .admin-sidebar__logo {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
          min-width: 0;
          flex: 1;
          overflow: hidden;
        }
        .admin-sidebar__logo-icon {
          width: 36px;
          height: 36px;
          background: var(--grad-brand);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
          box-shadow: 0 0 16px rgba(0,212,255,0.4);
        }
        .admin-sidebar__logo-text {
          overflow: hidden;
          transition: opacity 0.2s, width 0.3s;
          white-space: nowrap;
        }
        .admin-sidebar--collapsed .admin-sidebar__logo-text {
          opacity: 0;
          width: 0;
        }
        .admin-sidebar__logo-title {
          font-weight: 800;
          font-size: 0.9rem;
          background: var(--grad-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
          letter-spacing: 0.02em;
        }
        .admin-sidebar__logo-sub {
          font-size: 0.7rem;
          color: var(--text-2);
          display: block;
        }
        .admin-sidebar__collapse-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .admin-sidebar__collapse-btn:hover {
          border-color: var(--cyan);
          color: var(--cyan);
          background: rgba(0,212,255,0.1);
        }
        .admin-sidebar__nav {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem 0.5rem;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }
        .admin-sidebar__nav::-webkit-scrollbar { width: 4px; }
        .admin-sidebar__nav::-webkit-scrollbar-track { background: transparent; }
        .admin-sidebar__nav::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        .admin-sidebar__section {
          margin-bottom: 0.5rem;
        }
        .admin-sidebar__section-title {
          font-size: 0.63rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-2);
          opacity: 0.6;
          padding: 0.5rem 0.75rem 0.25rem;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          transition: opacity 0.2s;
        }
        .admin-sidebar--collapsed .admin-sidebar__section-title {
          opacity: 0;
          height: 0;
          padding: 0;
        }
        .admin-sidebar__link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.55rem 0.75rem;
          border-radius: 8px;
          text-decoration: none;
          color: var(--text-2);
          transition: all 0.18s ease;
          margin-bottom: 2px;
          position: relative;
          border-left: 2px solid transparent;
          overflow: hidden;
          white-space: nowrap;
        }
        .admin-sidebar__link:hover {
          background: rgba(0,212,255,0.07);
          color: var(--text);
          border-left-color: var(--cyan);
        }
        .admin-sidebar__link--active {
          background: linear-gradient(90deg, rgba(0,212,255,0.12) 0%, transparent 100%);
          color: var(--cyan);
          border-left-color: var(--cyan);
          box-shadow: inset 0 0 20px rgba(0,212,255,0.05);
        }
        .admin-sidebar__link-icon {
          font-size: 1rem;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }
        .admin-sidebar__link-content {
          overflow: hidden;
          transition: opacity 0.2s, width 0.3s;
        }
        .admin-sidebar--collapsed .admin-sidebar__link-content {
          opacity: 0;
          width: 0;
        }
        .admin-sidebar__link-label {
          font-weight: 600;
          font-size: 0.82rem;
          display: block;
          line-height: 1.2;
        }
        .admin-sidebar__link-desc {
          font-size: 0.68rem;
          color: var(--text-2);
          opacity: 0.7;
          display: block;
        }
        .admin-sidebar__link--active .admin-sidebar__link-desc {
          color: var(--cyan);
          opacity: 0.6;
        }
        .admin-sidebar__footer {
          padding: 0.75rem 0.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex-shrink: 0;
        }
        .admin-sidebar__footer-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          text-decoration: none;
          color: var(--text-2);
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.18s;
          white-space: nowrap;
          overflow: hidden;
          border: 1px solid transparent;
        }
        .admin-sidebar__footer-link:hover {
          background: var(--surface);
          border-color: var(--border);
          color: var(--text);
        }
        .admin-sidebar__footer-link--chat:hover {
          border-color: var(--cyan);
          color: var(--cyan);
          background: rgba(0,212,255,0.07);
        }
        .admin-sidebar__footer-icon {
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        .admin-sidebar__footer-text {
          overflow: hidden;
          transition: opacity 0.2s, width 0.3s;
        }
        .admin-sidebar--collapsed .admin-sidebar__footer-text {
          opacity: 0;
          width: 0;
        }
        .admin-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: var(--bg);
        }
        .admin-content__body {
          flex: 1;
          padding: 1.5rem 2rem 2rem;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .admin-sidebar { width: 68px; }
          .admin-sidebar__logo-text,
          .admin-sidebar__link-content,
          .admin-sidebar__section-title,
          .admin-sidebar__footer-text { opacity: 0; width: 0; }
          .admin-content__body { padding: 1rem; }
        }
      `}</style>

      <aside className={`admin-sidebar ${collapsed ? "admin-sidebar--collapsed" : ""}`}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__header-inner">
            <Link href="/admin" className="admin-sidebar__logo">
              <div className="admin-sidebar__logo-icon">⚡</div>
              <div className="admin-sidebar__logo-text">
                <span className="admin-sidebar__logo-title">PC Builder Admin</span>
                <span className="admin-sidebar__logo-sub">{isAdmin ? "Quản trị hệ thống" : "Nhân viên"}</span>
              </div>
            </Link>
            <button
              type="button"
              className="admin-sidebar__collapse-btn"
              onClick={() => setCollapsed((c) => !c)}
              title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
              {collapsed ? "→" : "←"}
            </button>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {visibleSections.map((section) => (
            <div key={section.title} className="admin-sidebar__section">
              <span className="admin-sidebar__section-title">{section.title}</span>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`admin-sidebar__link ${isActive(link.href) ? "admin-sidebar__link--active" : ""}`}
                >
                  <span className="admin-sidebar__link-icon">{link.icon}</span>
                  <span className="admin-sidebar__link-content">
                    <span className="admin-sidebar__link-label">{link.label}</span>
                    <span className="admin-sidebar__link-desc">{link.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <Link href="/" className="admin-sidebar__footer-link">
            <span className="admin-sidebar__footer-icon">🏠</span>
            <span className="admin-sidebar__footer-text">Về trang chủ</span>
          </Link>
          <Link href="/chat" className="admin-sidebar__footer-link admin-sidebar__footer-link--chat">
            <span className="admin-sidebar__footer-icon">💬</span>
            <span className="admin-sidebar__footer-text">Mở Chatbot</span>
          </Link>
        </div>
      </aside>

      <section className="admin-content">
        <AdminHeader title="Quản trị hệ thống" />
        <div className="admin-content__body">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </section>
    </div>
  );
};

export default AdminLayout;
