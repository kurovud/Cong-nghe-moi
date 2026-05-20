"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AdminHeader({ title = "Admin" }: { title?: string }) {
  const { user } = useAuth();

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        <h2 className="admin-topbar__title">{title}</h2>
        <nav className="admin-breadcrumbs">
          <Link href="/admin">Dashboard</Link>
          <span> / </span>
          <span>{title}</span>
        </nav>
      </div>

      <div className="admin-topbar__right">
        <div className="admin-user">
          <span className="admin-user__avatar">{user?.name?.charAt(0) ?? "A"}</span>
          <div style={{ marginLeft: 8 }}>
            <div style={{ fontWeight: 700 }}>{user?.name || user?.email || "Admin"}</div>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{user?.role || "admin"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
