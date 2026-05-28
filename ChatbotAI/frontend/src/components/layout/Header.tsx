"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import type { Product } from "@/types/product.type";

const navLinks = [
  { href: "/products", label: "Sản phẩm", hasMega: true },
  { href: "/builds", label: "PC Build sẵn", hasMega: false },
  { href: "/services", label: "Dịch vụ", hasMega: false },
  { href: "/chat", label: "Tư vấn AI", hasMega: false },
];

const megaMenuComponents = [
  { icon: "🖥️", label: "CPU", desc: "Intel & AMD", href: "/products?category=cpu" },
  { icon: "🎮", label: "GPU / VGA", desc: "Gaming & Workstation", href: "/products?category=gpu" },
  { icon: "💾", label: "RAM", desc: "DDR4 & DDR5", href: "/products?category=ram" },
  { icon: "🔌", label: "Mainboard", desc: "Intel & AMD Platform", href: "/products?category=mainboard" },
  { icon: "💿", label: "SSD / HDD", desc: "NVMe & SATA", href: "/products?category=ssd" },
  { icon: "⚡", label: "PSU", desc: "Nguồn máy tính", href: "/products?category=psu" },
  { icon: "📦", label: "Case", desc: "ATX, mATX, ITX", href: "/products?category=case" },
  { icon: "❄️", label: "Tản nhiệt", desc: "Air & Liquid Cooling", href: "/products?category=cooling" },
];

const megaMenuPeripherals = [
  { icon: "🖱️", label: "Chuột Gaming", desc: "Optical & Laser", href: "/products?category=mouse" },
  { icon: "⌨️", label: "Bàn phím", desc: "Cơ & Membrane", href: "/products?category=keyboard" },
  { icon: "🎧", label: "Tai nghe", desc: "Stereo & 7.1 Surround", href: "/products?category=headset" },
  { icon: "🖥️", label: "Màn hình", desc: "144Hz & 4K", href: "/products?category=monitor" },
  { icon: "📷", label: "Webcam", desc: "Full HD & 4K", href: "/products?category=webcam" },
];

/* ---- SVG Icons ---- */
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
);
const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
  </svg>
);
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14" style={{ transition: 'transform 0.2s' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
  </svg>
);

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

/* Countdown Hook */
function useCountdown(targetHour = 23, targetMin = 59, targetSec = 59) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(targetHour, targetMin, targetSec, 0);
      if (end <= now) end.setDate(end.getDate() + 1);
      const diff = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
      setTime({ h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetHour, targetMin, targetSec]);
  return time;
}

const pad = (n: number) => String(n).padStart(2, "0");

const Header = () => {
  const { user, cart, unreadCount, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const menuCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const countdown = useCountdown();

  const debouncedQuery = useMemo(() => query.trim(), [query]);

  // Sticky scroll behavior
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setLoadingSearch(false);
      return;
    }
    setLoadingSearch(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/products?q=${encodeURIComponent(debouncedQuery)}&limit=8`, { cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        setResults(Array.isArray(data?.products) ? data.products : []);
      } catch {
        setResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [debouncedQuery]);

  const cartItemCount = cart.totalItems;

  const openUserMenu = () => {
    if (menuCloseTimerRef.current) {
      clearTimeout(menuCloseTimerRef.current);
      menuCloseTimerRef.current = null;
    }
    setMenuOpen(true);
  };

  const closeUserMenuSoon = () => {
    if (menuCloseTimerRef.current) {
      clearTimeout(menuCloseTimerRef.current);
    }
    menuCloseTimerRef.current = setTimeout(() => {
      setMenuOpen(false);
      menuCloseTimerRef.current = null;
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (menuCloseTimerRef.current) {
        clearTimeout(menuCloseTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.5); }
          50% { box-shadow: 0 0 0 5px rgba(249,115,22,0); }
        }
        .cart-badge-pulse { animation: badge-pulse 2s ease-in-out infinite; }
        @keyframes promo-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slide-down-menu {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-from-right {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .mega-menu-animate { animation: slide-down-menu 0.28s cubic-bezier(0.4,0,0.2,1); }
        .mobile-menu-animate { animation: slide-in-from-right 0.3s cubic-bezier(0.4,0,0.2,1); }
        .nav-products-wrapper { position: relative; }
        .promo-ticker { display: flex; gap: 3rem; animation: promo-slide 22s linear infinite; white-space: nowrap; }
      `}</style>

      {/* Promo Strip (Desktop only) */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(0,212,255,0.07) 0%, rgba(168,85,247,0.07) 50%, rgba(0,212,255,0.07) 100%)',
        borderBottom: '1px solid rgba(0,212,255,0.12)',
        padding: '7px 0',
        position: 'sticky',
        top: 'var(--header-h)',
        zIndex: 998,
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
      }} className="promo-strip">
        <div style={{ overflow: 'hidden', width: '100%' }}>
          <div className="promo-ticker">
            <span style={{ display: 'flex', alignItems: 'center', gap: '3rem', fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-2)' }}>
              <span>🚚 <strong style={{ color: 'var(--cyan)' }}>MIỄN PHÍ VẬN CHUYỂN</strong> đơn từ 5 triệu</span>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
              <span>⚡ Deal hôm nay kết thúc lúc <strong style={{ color: 'var(--orange)', fontVariantNumeric: 'tabular-nums' }}>
                {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
              </strong></span>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
              <span>🎁 Bảo hành chính hãng 12–36 tháng</span>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
              <span>💬 Tư vấn AI 24/7 <Link href="/chat" style={{ color: 'var(--cyan)', fontWeight: 700 }}>Dùng ngay →</Link></span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className="header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 'var(--header-h)',
          background: scrolled
            ? 'rgba(5,13,26,0.97)'
            : 'rgba(5,13,26,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: scrolled
            ? '1px solid rgba(0,212,255,0.2)'
            : '1px solid var(--border)',
          boxShadow: scrolled
            ? '0 4px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.08)'
            : 'none',
          transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
          marginTop: 0,
        }}
      >
        <div className="container nav-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo" style={{ flexShrink: 0, textDecoration: 'none' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: 'var(--grad-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#fff',
              boxShadow: '0 0 20px rgba(0,212,255,0.4)',
              flexShrink: 0,
              letterSpacing: '-0.03em',
            }}>PB</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                PC Builder<span style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Shop</span>
              </span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-3)', fontWeight: 500, letterSpacing: '0.04em', lineHeight: 1 }}>Linh kiện chính hãng</span>
            </div>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="nav-hamburger"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((s) => !s)}
            style={{ marginLeft: 'auto', display: 'none' }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          {/* Nav Links - Desktop */}
          <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', marginLeft: '0.75rem' }}>
            {navLinks.map((item) =>
              item.hasMega ? (
                <div
                  key={item.href}
                  className="nav-products-wrapper"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <Link
                    href={item.href}
                    className="nav-link"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                    <span style={{ transform: megaOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'flex' }}>
                      <ChevronDown />
                    </span>
                  </Link>

                  {/* Mega Menu */}
                  {megaOpen && (
                    <div className="mega-menu mega-menu-animate" style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 'min(900px, 95vw)',
                      background: 'rgba(8,15,30,0.98)',
                      border: '1px solid var(--border-2)',
                      borderRadius: 'var(--r-xl)',
                      padding: '1.5rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr auto',
                      gap: '2rem',
                      boxShadow: 'var(--shadow-lg), 0 0 60px rgba(0,212,255,0.08)',
                      backdropFilter: 'blur(20px)',
                      zIndex: 500,
                    }}>
                      {/* Arrow */}
                      <div style={{
                        position: 'absolute',
                        top: -6,
                        left: '50%',
                        width: 12,
                        height: 12,
                        background: 'rgba(8,15,30,0.98)',
                        border: '1px solid var(--border-2)',
                        borderRight: 'none',
                        borderBottom: 'none',
                        transform: 'translateX(-50%) rotate(45deg)',
                      }} />

                      {/* Column 1: Components */}
                      <div>
                        <div className="mega-menu__col-title">⚙️ Linh kiện PC</div>
                        {megaMenuComponents.map((item) => (
                          <Link key={item.label} href={item.href} className="mega-menu__item" onClick={() => setMegaOpen(false)}>
                            <span className="mega-menu__item-icon">{item.icon}</span>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>{item.label}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 1 }}>{item.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Column 2: Peripherals */}
                      <div>
                        <div className="mega-menu__col-title">🖱️ Ngoại vi & Phụ kiện</div>
                        {megaMenuPeripherals.map((item) => (
                          <Link key={item.label} href={item.href} className="mega-menu__item" onClick={() => setMegaOpen(false)}>
                            <span className="mega-menu__item-icon">{item.icon}</span>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>{item.label}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 1 }}>{item.desc}</div>
                            </div>
                          </Link>
                        ))}
                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                          <div className="mega-menu__col-title">🛍️ Xem tất cả</div>
                          <Link href="/products" className="mega-menu__item" onClick={() => setMegaOpen(false)}>
                            <span className="mega-menu__item-icon">📋</span>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>Tất cả sản phẩm</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 1 }}>Xem toàn bộ danh mục</div>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Column 3: Deal Banner */}
                      <div style={{ width: 200 }}>
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(168,85,247,0.15) 100%)',
                          border: '1px solid rgba(249,115,22,0.25)',
                          borderRadius: 'var(--r-lg)',
                          padding: '1.25rem',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem',
                        }}>
                          <div style={{ fontSize: '1.5rem' }}>🔥</div>
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.3rem' }}>DEAL HÔM NAY</div>
                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.25 }}>Giảm đến 40% linh kiện gaming</div>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                            CPU, GPU, RAM và nhiều linh kiện đang sale hot hôm nay
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                            ⏰ Còn <strong style={{ color: 'var(--orange)', fontVariantNumeric: 'tabular-nums' }}>{pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}</strong>
                          </div>
                          <Link
                            href="/products?sale=true"
                            onClick={() => setMegaOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem',
                              padding: '0.6rem 1rem',
                              background: 'var(--grad-orange)',
                              borderRadius: 'var(--r-sm)',
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              textDecoration: 'none',
                              boxShadow: '0 4px 16px rgba(249,115,22,0.4)',
                              marginTop: 'auto',
                            }}
                          >
                            Xem ngay →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.href} href={item.href} className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Search */}
          <div
            className="nav-search"
            style={{ flex: 1, maxWidth: 400, position: 'relative' }}
            onFocus={() => setOpenSearch(true)}
            onBlur={() => setTimeout(() => setOpenSearch(false), 150)}
          >
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none', display: 'flex' }}>
                <SearchIcon />
              </div>
              <input
                className="nav-search__input"
                placeholder="Tìm CPU, GPU, RAM, SSD..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
            {openSearch && query.trim().length > 0 && (
              <div className="nav-search__panel">
                {loadingSearch ? (
                  <div className="nav-search__empty">⏳ Đang tìm kiếm...</div>
                ) : results.length === 0 ? (
                  <div className="nav-search__empty">😔 Không tìm thấy sản phẩm phù hợp</div>
                ) : (
                  results.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.category}/${item.id}`}
                      className="nav-search__item"
                      onClick={() => { setQuery(""); setOpenSearch(false); }}
                    >
                      <img loading="lazy" decoding="async" src={item.image} alt={item.name} className="nav-search__thumb" />
                      <div className="nav-search__meta">
                        <span className="nav-search__name">{item.name}</span>
                        <span className="nav-search__price">
                          {(item.discountPrice ?? item.price).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="nav-actions">
            {/* Notifications */}
            {user && (
              <Link href="/account/orders" className="nav-icon-btn" title="Thông báo">
                <BellIcon />
                {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
              </Link>
            )}

            {/* Wishlist */}
            <Link href="/account/wishlist" className="nav-icon-btn" title="Yêu thích">
              <HeartIcon />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="nav-icon-btn" title="Giỏ hàng" style={{ position: 'relative' }}>
              <CartIcon />
              {cartItemCount > 0 && (
                <span className={`nav-badge ${cartItemCount > 0 ? 'cart-badge-pulse' : ''}`}>
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div
                className="nav-user"
                onMouseEnter={openUserMenu}
                onMouseLeave={closeUserMenuSoon}
              >
                <button type="button" className="nav-user__btn" style={{ gap: '0.6rem', padding: '0 0.75rem' }}>
                  {/* User Avatar with initials */}
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--grad-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: '#fff',
                    flexShrink: 0,
                    letterSpacing: '0.02em',
                  }}>
                    {getInitials(user.name)}
                  </div>
                  <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(" ").pop()}
                  </span>
                  <ChevronDown />
                </button>
                {menuOpen && (
                  <div className="nav-dropdown" onMouseEnter={openUserMenu} onMouseLeave={closeUserMenuSoon}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'var(--grad-brand)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: '#fff',
                        flexShrink: 0,
                      }}>
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{user.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{user.email ?? ''}</div>
                      </div>
                    </div>
                    <Link href="/account" className="nav-dropdown__item">👤 Tài khoản</Link>
                    <Link href="/account/orders" className="nav-dropdown__item">📦 Đơn hàng</Link>
                    <Link href="/account/wishlist" className="nav-dropdown__item">❤️ Yêu thích</Link>
                    {user.role !== "customer" && (
                      <Link href="/admin" className="nav-dropdown__item">⚙️ Backoffice</Link>
                    )}
                    <button
                      type="button"
                      className="nav-dropdown__item nav-dropdown__item--danger"
                      onClick={logout}
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="button btn-sm">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 998,
            }}
          />
          {/* Slide-in panel from right */}
          <div
            className="mobile-menu-animate"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(320px, 85vw)',
              background: 'rgba(8,15,30,0.99)',
              backdropFilter: 'blur(24px)',
              borderLeft: '1px solid var(--border-2)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              padding: '1.25rem',
              gap: '0.5rem',
              overflowY: 'auto',
            }}
          >
            {/* Mobile header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)' }}>Menu</div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: 'var(--r-sm)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <CloseIcon />
              </button>
            </div>

            {/* Mobile search */}
            <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
              <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none', display: 'flex' }}>
                <SearchIcon />
              </div>
              <input
                className="nav-search__input"
                placeholder="Tìm sản phẩm..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ paddingLeft: '2.4rem', width: '100%', borderRadius: 'var(--r)' }}
              />
            </div>

            {/* Mobile nav links */}
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                style={{ padding: '0.85rem 1rem', borderRadius: 'var(--r)', fontSize: '0.95rem' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {user ? (
                <>
                  <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }} onClick={() => setMobileMenuOpen(false)}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{getInitials(user.name)}</div>
                    <span>{user.name}</span>
                  </Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ width: '100%', padding: '0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--r)', color: 'var(--red)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link href="/login" className="button" style={{ width: '100%', textAlign: 'center' }} onClick={() => setMobileMenuOpen(false)}>
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-hamburger { display: flex !important; }
          .nav-links { display: none !important; }
          .nav-search { display: none !important; }
          .hide-mobile { display: none !important; }
        }
        @media (max-width: 900px) {
          .promo-ticker { gap: 1.5rem; animation-duration: 30s; white-space: normal; flex-wrap: wrap; }
        }
        @media (max-width: 640px) {
          .promo-ticker { gap: 0.9rem; }
        }
      `}</style>
    </>
  );
};

export default Header;
