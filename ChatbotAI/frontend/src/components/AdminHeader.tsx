"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AdminHeader({ title = "Admin" }: { title?: string }) {
  const { user } = useAuth();

  const initials = user?.name?.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() ?? 'A';

  return (
    <header style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0.75rem 1.5rem',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div>
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 800,
          fontSize: '1.1rem', color: 'var(--text)',
          letterSpacing: '-0.02em', marginBottom: '0.15rem',
        }}>
          {title}
        </h2>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-3)' }}>
          <Link href="/admin" style={{ color: 'var(--text-3)', transition: 'color 0.2s' }}>
            Dashboard
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text-2)' }}>{title}</span>
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Date badge */}
        <div style={{
          padding: '0.3rem 0.75rem', borderRadius: 'var(--r-sm)',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 600,
        }}>
          {new Date().toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' })}
        </div>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--grad-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.78rem', fontWeight: 800, color: '#fff',
            boxShadow: '0 0 12px rgba(0,212,255,0.2)',
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.3 }}>
              {user?.name || user?.email || 'Admin'}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {user?.role || 'admin'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
