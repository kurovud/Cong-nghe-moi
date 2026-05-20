"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { productApi } from "@/services/paper.api";
import type { Product } from "@/types/product.type";

const navLinks = [
  { href: "/products", label: "Sản phẩm" },
  { href: "/builds", label: "PC Build sẵn" },
  { href: "/services", label: "Dịch vụ" },
  { href: "/chat", label: "Tư vấn AI" },
];

const Header = () => {
  const { user, cart, unreadCount, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [results, setResults] = useState<Product[]>([]);

  const debouncedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setLoadingSearch(false);
      return;
    }

    setLoadingSearch(true);
    const timer = setTimeout(async () => {
      try {
        const response = await productApi.searchProducts(debouncedQuery, 8);
        setResults(response?.data ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [debouncedQuery]);

  return (
    <header className="header">
      <div className="container nav-inner">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          <span className="nav-logo__mark">PB</span>
          PC&nbsp;Builder&nbsp;Shop
        </Link>

        {/* Links */}
        <button
          type="button"
          className="nav-hamburger"
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((s) => !s)}
        >
          ☰
        </button>
        <nav className={"nav-links " + (mobileMenuOpen ? 'open' : '')}>
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-search" onFocus={() => setOpenSearch(true)} onBlur={() => setTimeout(() => setOpenSearch(false), 120)}>
          <input
            className="nav-search__input"
            placeholder="Tìm CPU, GPU, RAM..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {openSearch && (query.trim().length > 0) && (
            <div className="nav-search__panel">
              {loadingSearch ? (
                <div className="nav-search__empty">Đang tìm kiếm...</div>
              ) : results.length === 0 ? (
                <div className="nav-search__empty">Không tìm thấy sản phẩm phù hợp</div>
              ) : (
                results.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.category}/${item.id}`}
                    className="nav-search__item"
                    onClick={() => {
                      setQuery("");
                      setOpenSearch(false);
                    }}
                  >
                    <img src={item.image} alt={item.name} className="nav-search__thumb" />
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
              TB{unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
            </Link>
          )}

          {/* Wishlist */}
          <Link href="/account/wishlist" className="nav-icon-btn" title="Yêu thích">
            YT
          </Link>

          {/* Cart */}
          <Link href="/cart" className="nav-icon-btn" title="Giỏ hàng">
            GH{cart.totalItems > 0 && <span className="nav-badge">{cart.totalItems}</span>}
          </Link>

          {/* User */}
          {user ? (
            <div className="nav-user" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
              <button type="button" className="nav-user__btn">
                {user.name.split(" ").pop()}
              </button>
              {menuOpen && (
                <div className="nav-dropdown">
                  <Link href="/account" className="nav-dropdown__item">Tài khoản</Link>
                  <Link href="/account/orders" className="nav-dropdown__item">Đơn hàng</Link>
                  <Link href="/account/wishlist" className="nav-dropdown__item">Yêu thích</Link>
                  {user.role !== "customer" && <Link href="/admin" className="nav-dropdown__item">Backoffice</Link>}
                  <button type="button" className="nav-dropdown__item nav-dropdown__item--danger" onClick={logout}>Đăng xuất</button>
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
  );
};

export default Header;
