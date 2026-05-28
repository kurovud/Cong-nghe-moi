'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/product.type';
import { resolveProductImage } from '@/lib/product-image';
import { useAuth } from '@/components/providers/AuthProvider';
import { cartApi, wishlistApi } from '@/services/conference.api';

interface Props {
  initialCategory?: string;
  initialQuery?: string;
}

const BRANDS = ['ASUS', 'MSI', 'Gigabyte', 'NVIDIA', 'AMD', 'Intel', 'Corsair'];
const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả giá', short: 'Tất cả' },
  { id: '0-5m', label: 'Dưới 5 triệu', short: '<5M' },
  { id: '5-10m', label: '5 – 10 triệu', short: '5-10M' },
  { id: '10-20m', label: '10 – 20 triệu', short: '10-20M' },
  { id: '20m+', label: 'Trên 20 triệu', short: '>20M' },
];

const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const scoreSearchMatch = (product: Product, query: string) => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 0;

  const haystack = normalizeSearchText([
    product.name,
    product.shortDesc,
    product.brand,
    product.category,
    JSON.stringify(product.specs ?? {}),
  ].filter(Boolean).join(' '));

  const terms = normalizedQuery.split(' ').filter(Boolean);
  let score = 0;
  for (const term of terms) {
    if (haystack.includes(term)) score += 1;
  }
  if (haystack.includes(normalizedQuery)) score += 2;
  return score;
};

export default function ProductsClient({ initialCategory, initialQuery }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory ?? 'all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery ?? '');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [preorderOnly, setPreorderOnly] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    brand: true,
    price: true,
    stock: true,
    rating: true,
  });
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const ITEMS_PER_PAGE = gridCols === 4 ? 12 : 9;

  const categories = [
    { id: 'all', name: 'Tất cả sản phẩm', icon: '🛒' },
    { id: 'cpu', name: 'CPU', icon: '💻' },
    { id: 'gpu', name: 'GPU', icon: '🎮' },
    { id: 'mainboard', name: 'Mainboard', icon: '⚡' },
    { id: 'ram', name: 'RAM', icon: '🧠' },
    { id: 'ssd', name: 'SSD', icon: '💾' },
    { id: 'hdd', name: 'HDD', icon: '📀' },
    { id: 'case', name: 'Case', icon: '🖥️' },
    { id: 'psu', name: 'PSU', icon: '⚙️' },
    { id: 'cooler', name: 'Tản nhiệt', icon: '🌡️' },
    { id: 'monitor', name: 'Màn hình', icon: '🖥️' },
    { id: 'keyboard', name: 'Bàn phím', icon: '⌨️' },
    { id: 'mouse', name: 'Chuột', icon: '🖱️' },
    { id: 'headset', name: 'Tai nghe', icon: '🎧' },
    { id: 'laptop', name: 'Laptop', icon: '💻' },
    { id: 'prebuilt', name: 'PC nguyên bộ', icon: '🧩' },
  ];

  // ─── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialCategory && categories.some((c) => c.id === initialCategory)) {
      setSelectedCategory(initialCategory);
    }
    if (initialQuery) setSearchQuery(initialQuery);
  }, [initialCategory, initialQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/products?limit=999');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearchQuery(searchQuery.trim()), 220);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let filtered = products.slice();
    const normalizedQuery = normalizeSearchText(debouncedSearchQuery);

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category?.toLowerCase().includes(selectedCategory));
    }
    if (normalizedQuery) {
      filtered = filtered
        .map((product) => ({ product, score: scoreSearchMatch(product, normalizedQuery) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.product);
    }
    if (selectedPrice !== 'all') {
      switch (selectedPrice) {
        case '0-5m':
          filtered = filtered.filter((p) => Number(p.price ?? 0) < 5000000);
          break;
        case '5-10m':
          filtered = filtered.filter((p) => Number(p.price ?? 0) >= 5000000 && Number(p.price ?? 0) < 10000000);
          break;
        case '10-20m':
          filtered = filtered.filter((p) => Number(p.price ?? 0) >= 10000000 && Number(p.price ?? 0) < 20000000);
          break;
        case '20m+':
          filtered = filtered.filter((p) => Number(p.price ?? 0) >= 20000000);
          break;
      }
    }
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.some((b) => p.brand?.toLowerCase().includes(b.toLowerCase())));
    }
    if (selectedRating > 0) {
      filtered = filtered.filter((p) => Number(p.rating ?? 0) >= selectedRating);
    }
    if (inStockOnly) {
      filtered = filtered.filter((p) => Number(p.stock ?? 0) > 0);
    }

    switch (sortBy) {
      case 'price-low':
        filtered = filtered.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0));
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedCategory, selectedPrice, debouncedSearchQuery, sortBy, selectedBrands, selectedRating, inStockOnly]);

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const getDiscountPct = (product: Product) => {
    if (!product.discountPrice || product.discountPrice >= product.price) return 0;
    return Math.round(((product.price - product.discountPrice) / product.price) * 100);
  };
  const getDisplayPrice = (product: Product) =>
    product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]);
  };
  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedPrice !== 'all' || searchQuery || selectedBrands.length > 0 || selectedRating > 0 || inStockOnly;

  const resetAll = () => {
    setSelectedCategory('all');
    setSelectedPrice('all');
    setSearchQuery('');
    setSelectedBrands([]);
    setSelectedRating(0);
    setInStockOnly(false);
    setPreorderOnly(false);
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Active filter chips
  const activeChips: Array<{ label: string; onRemove: () => void }> = [];
  if (selectedCategory !== 'all') {
    const cat = categories.find((c) => c.id === selectedCategory);
    activeChips.push({ label: cat?.name ?? selectedCategory, onRemove: () => setSelectedCategory('all') });
  }
  if (selectedPrice !== 'all') {
    const pr = PRICE_RANGES.find((r) => r.id === selectedPrice);
    activeChips.push({ label: pr?.label ?? selectedPrice, onRemove: () => setSelectedPrice('all') });
  }
  selectedBrands.forEach((b) => activeChips.push({ label: b, onRemove: () => toggleBrand(b) }));
  if (selectedRating > 0) activeChips.push({ label: `${selectedRating}★+`, onRemove: () => setSelectedRating(0) });
  if (inStockOnly) activeChips.push({ label: 'Còn hàng', onRemove: () => setInStockOnly(false) });

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ── Hero ── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '3.5rem 0 2.5rem',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(0,212,255,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(168,85,247,0.08) 0%, transparent 60%), var(--bg)',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        {/* grid bg */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'absolute', width: 300, height: 300, top: -80, left: '5%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.07), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, bottom: -60, right: '10%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.07), transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', marginBottom: '1.25rem', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '999px', backdropFilter: 'blur(12px)' }}>
            <Link href="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>🏠 Trang chủ</Link>
            <span style={{ color: 'var(--border-2)' }}>›</span>
            <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>Sản phẩm</span>
          </nav>
          <span style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cyan)', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', padding: '0.3rem 0.85rem', borderRadius: '999px', marginBottom: '0.75rem' }}>
            🛍️ STORE
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: '0 0 0.5rem 0' }}>
            TẤT CẢ SẢN PHẨM
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', maxWidth: 480, margin: '0 auto' }}>
            Kho hàng <strong style={{ color: 'var(--cyan)' }}>{products.length}</strong> sản phẩm gaming chính hãng · Cập nhật liên tục
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="products-page-layout">

          {/* ══════════════════════════════ SIDEBAR ══════════════════════════════ */}
          <aside className="filter-sidebar">
            {/* Header */}
            <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(0,212,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.05em' }}>
                <span>⚗️</span> BỘ LỌC
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAll}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: '0.2rem 0.5rem', borderRadius: '4px', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  ✕ Reset
                </button>
              )}
            </div>

            {/* Active Chips */}
            {activeChips.length > 0 && (
              <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {activeChips.map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={chip.onRemove}
                    className="active-filter-chip"
                  >
                    {chip.label} ✕
                  </button>
                ))}
              </div>
            )}

            {/* ── Category Section ── */}
            <div className="filter-section">
              <div className="filter-section__header" onClick={() => toggleSection('category')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📂 Danh mục</span>
                <span style={{ transition: 'transform 0.2s', transform: openSections.category ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--text-3)', fontSize: '0.7rem' }}>▼</span>
              </div>
              {openSections.category && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.55rem', width: '100%',
                        padding: '0.45rem 0.65rem', borderRadius: '6px', border: 'none',
                        background: selectedCategory === cat.id ? 'rgba(0,212,255,0.08)' : 'transparent',
                        color: selectedCategory === cat.id ? 'var(--cyan)' : 'var(--text-2)',
                        fontSize: '0.83rem', fontWeight: selectedCategory === cat.id ? 600 : 400,
                        textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
                        outline: selectedCategory === cat.id ? '1px solid rgba(0,212,255,0.2)' : 'none',
                      }}
                      onMouseEnter={(e) => { if (selectedCategory !== cat.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text)'; } }}
                      onMouseLeave={(e) => { if (selectedCategory !== cat.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; } }}
                    >
                      <span style={{ fontSize: '0.95rem', width: 18, textAlign: 'center' }}>{cat.icon}</span>
                      <span style={{ flex: 1 }}>{cat.name}</span>
                      {selectedCategory === cat.id && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 6px rgba(0,212,255,0.6)', flexShrink: 0 }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Brand Section ── */}
            <div className="filter-section">
              <div className="filter-section__header" onClick={() => toggleSection('brand')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>🏷️ Thương hiệu</span>
                <span style={{ transition: 'transform 0.2s', transform: openSections.brand ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--text-3)', fontSize: '0.7rem' }}>▼</span>
              </div>
              {openSections.brand && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {BRANDS.map((brand) => (
                    <label
                      key={brand}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.2rem 0' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        style={{ display: 'none' }}
                      />
                      <span style={{
                        width: 16, height: 16, borderRadius: 4,
                        border: selectedBrands.includes(brand) ? '2px solid var(--cyan)' : '1.5px solid var(--border-2)',
                        background: selectedBrands.includes(brand) ? 'var(--cyan)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s', flexShrink: 0,
                      }}>
                        {selectedBrands.includes(brand) && <span style={{ color: '#050d1a', fontSize: '0.6rem', fontWeight: 900 }}>✓</span>}
                      </span>
                      <span style={{ fontSize: '0.83rem', color: selectedBrands.includes(brand) ? 'var(--text)' : 'var(--text-2)', fontWeight: selectedBrands.includes(brand) ? 600 : 400, transition: 'color 0.15s' }}>
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ── Price Section ── */}
            <div className="filter-section">
              <div className="filter-section__header" onClick={() => toggleSection('price')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>💰 Khoảng giá</span>
                <span style={{ transition: 'transform 0.2s', transform: openSections.price ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--text-3)', fontSize: '0.7rem' }}>▼</span>
              </div>
              {openSections.price && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => setSelectedPrice(range.id)}
                      style={{
                        padding: '0.5rem 0.4rem',
                        borderRadius: '6px',
                        border: selectedPrice === range.id ? '1px solid rgba(249,115,22,0.5)' : '1px solid var(--border)',
                        background: selectedPrice === range.id ? 'rgba(249,115,22,0.1)' : 'var(--surface)',
                        color: selectedPrice === range.id ? 'var(--orange)' : 'var(--text-2)',
                        fontSize: '0.77rem', fontWeight: selectedPrice === range.id ? 700 : 400,
                        cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                        gridColumn: range.id === 'all' ? 'span 2' : 'span 1',
                      }}
                    >
                      {range.short}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Stock Section ── */}
            <div className="filter-section">
              <div className="filter-section__header" onClick={() => toggleSection('stock')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📦 Tình trạng</span>
                <span style={{ transition: 'transform 0.2s', transform: openSections.stock ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--text-3)', fontSize: '0.7rem' }}>▼</span>
              </div>
              {openSections.stock && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { label: '✅ Còn hàng', value: inStockOnly, onChange: () => setInStockOnly(!inStockOnly) },
                    { label: '⏳ Đang đặt hàng', value: preorderOnly, onChange: () => setPreorderOnly(!preorderOnly) },
                  ].map(({ label, value, onChange }) => (
                    <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={value} onChange={onChange} style={{ display: 'none' }} />
                      <span style={{
                        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                        border: value ? '2px solid var(--cyan)' : '1.5px solid var(--border-2)',
                        background: value ? 'var(--cyan)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                      }}>
                        {value && <span style={{ color: '#050d1a', fontSize: '0.6rem', fontWeight: 900 }}>✓</span>}
                      </span>
                      <span style={{ fontSize: '0.83rem', color: value ? 'var(--text)' : 'var(--text-2)', fontWeight: value ? 600 : 400 }}>{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ── Rating Section ── */}
            <div className="filter-section">
              <div className="filter-section__header" onClick={() => toggleSection('rating')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>⭐ Đánh giá</span>
                <span style={{ transition: 'transform 0.2s', transform: openSections.rating ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--text-3)', fontSize: '0.7rem' }}>▼</span>
              </div>
              {openSections.rating && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedRating(selectedRating === star ? 0 : star)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.35rem 0.6rem', borderRadius: '6px', cursor: 'pointer', border: 'none',
                        background: selectedRating === star ? 'rgba(251,191,36,0.1)' : 'transparent',
                        outline: selectedRating === star ? '1px solid rgba(251,191,36,0.3)' : 'none',
                        transition: 'all 0.15s', width: '100%',
                      }}
                      onMouseEnter={(e) => { if (selectedRating !== star) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={(e) => { if (selectedRating !== star) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} style={{ color: s <= star ? '#fbbf24' : 'var(--border-2)', fontSize: '0.85rem' }}>★</span>
                      ))}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginLeft: '0.2rem' }}>trở lên</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* ══════════════════════════════ MAIN AREA ══════════════════════════════ */}
          <main>
            {/* ── Toolbar ── */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap',
              padding: '0.85rem 1.25rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              backdropFilter: 'blur(12px)',
              marginBottom: '1.25rem',
            }}>
              {/* Result count */}
              <span style={{ fontSize: '0.83rem', color: 'var(--text-3)', marginRight: '0.25rem' }}>
                Kết quả: <strong style={{ color: 'var(--cyan)', fontWeight: 700 }}>{filteredProducts.length}</strong> sản phẩm
              </span>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Search */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-3)', fontSize: '0.85rem', pointerEvents: 'none' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    height: 36, paddingLeft: '2.1rem', paddingRight: searchQuery ? '2rem' : '0.85rem',
                    width: 200, background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '999px', color: 'var(--text)', fontSize: '0.83rem', fontFamily: 'inherit',
                    outline: 'none', transition: 'all 0.2s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.08)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '0.6rem', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '0.8rem', padding: '0.2rem' }}>✕</button>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  height: 36, padding: '0 2rem 0 0.85rem',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--r)', color: 'var(--text)', fontSize: '0.83rem', fontFamily: 'inherit',
                  outline: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.65rem center',
                }}
              >
                <option value="newest">Mặc định</option>
                <option value="price-low">Giá tăng dần</option>
                <option value="price-high">Giá giảm dần</option>
                <option value="rating">Đánh giá cao</option>
              </select>

              {/* Grid Toggle */}
              <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                {([2, 3, 4] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setGridCols(n)}
                    title={`${n} cột`}
                    style={{
                      width: 32, height: 36, border: 'none', cursor: 'pointer',
                      background: gridCols === n ? 'rgba(0,212,255,0.12)' : 'var(--surface)',
                      color: gridCols === n ? 'var(--cyan)' : 'var(--text-3)',
                      fontSize: '0.7rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px',
                    }}
                  >
                    {Array.from({ length: n }).map((_, i) => (
                      <span key={i} style={{ width: 3, height: 14, background: 'currentColor', borderRadius: 1, display: 'block' }} />
                    ))}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Product Grid ── */}
            {isLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(3, 1fr)`, gap: '1.25rem' }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
                    <div style={{
                      width: '100%', aspectRatio: '1',
                      background: 'linear-gradient(90deg, var(--surface) 0%, rgba(255,255,255,0.06) 40%, var(--surface-2) 60%, var(--surface) 100%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s ease-in-out infinite',
                    }} />
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {[60, 90, 45, 100].map((w, j) => (
                        <div key={j} style={{
                          height: j === 2 ? 20 : 12, width: `${w}%`, borderRadius: 4,
                          background: 'linear-gradient(90deg, var(--surface) 0%, rgba(255,255,255,0.06) 40%, var(--surface-2) 60%, var(--surface) 100%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 1.5s ease-in-out infinite',
                          animationDelay: `${j * 0.1}s`,
                        }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: '1.25rem' }}>
                {paginatedProducts.map((product) => {
                  const discPct = getDiscountPct(product);
                  const displayPrice = getDisplayPrice(product);
                  const rating = Number(product.rating ?? 4.5);
                  const stock = Number(product.stock ?? 0);
                  const stockColor = stock > 10 ? 'var(--green)' : stock > 0 ? '#f59e0b' : '#ef4444';
                  const stockText = stock > 10 ? 'Còn hàng' : stock > 0 ? `Còn ${stock} sp` : 'Hết hàng';

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      discPct={discPct}
                      displayPrice={displayPrice}
                      rating={rating}
                      stockColor={stockColor}
                      stockText={stockText}
                    />
                  );
                })}
              </div>
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '5rem 2rem',
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-2xl)', animation: 'fadeIn 0.4s ease',
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.25rem', filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.4))', animation: 'float 4s ease-in-out infinite' }}>🔮</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Không tìm thấy sản phẩm</h3>
                <p style={{ color: 'var(--text-2)', maxWidth: 340, marginBottom: '1.5rem', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem thêm sản phẩm
                </p>
                <button
                  type="button"
                  onClick={resetAll}
                  style={{
                    padding: '0.75rem 1.75rem', borderRadius: '999px', border: 'none',
                    background: 'var(--grad-brand)', color: '#fff', fontWeight: 700,
                    fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: '0 4px 20px rgba(0,212,255,0.25)',
                  }}
                >
                  Xem tất cả sản phẩm
                </button>
              </div>
            )}

            {/* ── Pagination ── */}
            {!isLoading && totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.35rem', marginTop: '2.5rem' }}>
                <PaginationBtn disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} label="‹" />
                {Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => Math.abs(p - currentPage) < 3 || p === 1 || p === totalPages).reduce<(number | '...')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, []).map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} style={{ color: 'var(--text-3)', padding: '0 0.25rem', fontSize: '0.9rem' }}>…</span>
                  ) : (
                    <PaginationBtn key={p} active={currentPage === p} onClick={() => setCurrentPage(p as number)} label={String(p)} />
                  )
                )}
                <PaginationBtn disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} label="›" />
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,212,255,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(0,212,255,0); }
        }
        select option { background: #0e1a2e; }
      `}</style>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProductCard({ product, discPct, displayPrice, rating, stockColor, stockText }: {
  product: Product;
  discPct: number;
  displayPrice: number;
  rating: number;
  stockColor: string;
  stockText: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [busy, setBusy] = useState<'cart' | 'wishlist' | null>(null);
  const [message, setMessage] = useState('');
  const { user, cart, wishlist, refreshCart, refreshWishlist } = useAuth();
  const inWishlist = wishlist.some((item) => item.productId === product.id);

  const stopCardClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const addToCart = async (event: MouseEvent<HTMLButtonElement>) => {
    stopCardClick(event);
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setBusy('cart');
    try {
      const nextItems = [...cart.items];
      const existing = nextItems.find((item) => item.productId === product.id);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, existing.maxStock || product.stock || 1);
      } else {
        nextItems.push({
          productId: product.id,
          name: product.name,
          category: product.category,
          brand: product.brand,
          price: product.price,
          discountPrice: product.discountPrice,
          image: product.image,
          quantity: 1,
          maxStock: product.stock,
        });
      }

      await cartApi.updateItems(nextItems as any[]);
      await refreshCart();
      setMessage('Đã thêm vào giỏ hàng');
      setTimeout(() => setMessage(''), 2200);
    } catch {
      setMessage('Không thể thêm vào giỏ hàng');
      setTimeout(() => setMessage(''), 2200);
    } finally {
      setBusy(null);
    }
  };

  const toggleWishlist = async (event: MouseEvent<HTMLButtonElement>) => {
    stopCardClick(event);
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setBusy('wishlist');
    try {
      if (inWishlist) {
        await wishlistApi.removeItem(product.id);
      } else {
        await wishlistApi.addItem(product.id);
      }
      await refreshWishlist();
      setMessage(inWishlist ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
      setTimeout(() => setMessage(''), 2200);
    } catch {
      setMessage('Không thể cập nhật yêu thích');
      setTimeout(() => setMessage(''), 2200);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Link
      href={`/products/${product.category || 'cpu'}/${product.id}`}
      style={{
        display: 'flex', flexDirection: 'column', textDecoration: 'none', position: 'relative', overflow: 'hidden',
        background: 'rgba(255,255,255,0.03)',
        border: hovered ? '1px solid rgba(0,212,255,0.35)' : '1px solid var(--border)',
        borderRadius: 'var(--r-xl)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(0,212,255,0.12), 0 4px 16px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* SALE Badge */}
      {discPct > 0 && (
        <div style={{
          position: 'absolute', top: '0.65rem', right: '0.65rem', zIndex: 4,
          background: 'linear-gradient(135deg, #f97316, #ef4444)',
          color: '#fff', fontSize: '0.68rem', fontWeight: 800,
          padding: '0.2rem 0.5rem', borderRadius: '999px',
          boxShadow: '0 2px 12px rgba(249,115,22,0.45)', letterSpacing: '0.02em',
        }}>
          -{discPct}%
        </div>
      )}

      {/* Image Area */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(168,85,247,0.05) 100%)',
        borderRadius: 'var(--r-xl) var(--r-xl) 0 0',
        aspectRatio: '1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Cyan glow overlay on hover */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 30%, rgba(0,212,255,0.08), transparent 70%)',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none',
        }} />
        <img
          src={resolveProductImage(product.image, product.category)}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = resolveProductImage(null); }}
          style={{
            maxWidth: '78%', maxHeight: '78%', objectFit: 'contain',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            position: 'relative', zIndex: 1,
          }}
        />
        {/* Brand badge on image */}
        {product.brand && (
          <div style={{
            position: 'absolute', top: '0.6rem', left: '0.6rem', zIndex: 3,
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'var(--purple)',
            background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)',
            padding: '0.15rem 0.45rem', borderRadius: '999px', backdropFilter: 'blur(8px)',
          }}>
            {product.brand}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '1rem 1rem 1.1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
        {/* Product Name */}
        <h3 style={{
          color: 'var(--text)', fontFamily: 'var(--font-heading)',
          fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.4, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden',
          minHeight: '2.4em',
        }}>
          {product.name}
        </h3>

        {/* Stars + Reviews */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <div style={{ display: 'flex' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} style={{ color: s <= Math.round(rating) ? '#fbbf24' : 'var(--border-2)', fontSize: '0.75rem' }}>★</span>
            ))}
          </div>
          <span style={{ fontSize: '0.73rem', color: 'var(--text-3)' }}>{rating.toFixed(1)}</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>({Math.floor(Math.random() * 200 + 10)})</span>
        </div>

        {/* Price Block */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '1.05rem', fontWeight: 800, fontFamily: 'var(--font-heading)',
            background: 'linear-gradient(135deg, #00d4ff, #f97316)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {Number(displayPrice ?? 0).toLocaleString('vi-VN')}₫
          </span>
          {discPct > 0 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', textDecoration: 'line-through' }}>
              {Number(product.price ?? 0).toLocaleString('vi-VN')}₫
            </span>
          )}
        </div>

        {/* Stock indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.1rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: stockColor, boxShadow: `0 0 6px ${stockColor}`, flexShrink: 0, animation: stockColor === 'var(--green)' ? 'pulseGlow 2s infinite' : 'none' }} />
          <span style={{ fontSize: '0.72rem', color: stockColor, fontWeight: 500 }}>{stockText}</span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.45rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
          <button
            type="button"
            disabled={busy === 'cart'}
            style={{
              flex: 1, height: 34, borderRadius: '8px', border: 'none',
              background: busy === 'cart' ? 'rgba(0,212,255,0.12)' : hovered ? 'var(--grad-brand)' : 'rgba(0,212,255,0.08)',
              color: busy === 'cart' ? 'var(--cyan)' : hovered ? '#fff' : 'var(--cyan)',
              fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.25s', boxShadow: hovered && busy !== 'cart' ? '0 4px 14px rgba(0,212,255,0.25)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
            }}
            onClick={addToCart}
          >
            {busy === 'cart' ? 'Đang thêm…' : '🛒 Thêm giỏ'}
          </button>
          <button
            type="button"
            disabled={busy === 'wishlist'}
            style={{
              width: 34, height: 34, borderRadius: '8px', border: '1px solid var(--border)',
              background: inWishlist ? 'rgba(244,63,94,0.12)' : 'rgba(255,255,255,0.04)',
              color: busy === 'wishlist' ? '#f43f5e' : inWishlist ? '#f43f5e' : hovered ? '#f43f5e' : 'var(--text-3)',
              fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.25s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
            onClick={toggleWishlist}
          >
            {busy === 'wishlist' ? '…' : '❤'}
          </button>
        </div>
        {message && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', minHeight: '1rem' }}>
            {message}
          </div>
        )}
      </div>
    </Link>
  );
}

function PaginationBtn({ onClick, disabled, active, label }: { onClick: () => void; disabled?: boolean; active?: boolean; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        minWidth: 36, height: 36, padding: '0 0.6rem', borderRadius: '8px', cursor: disabled ? 'not-allowed' : 'pointer',
        border: active ? 'none' : '1px solid var(--border)',
        background: active ? 'var(--grad-brand)' : hov && !disabled ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.03)',
        color: active ? '#fff' : disabled ? 'var(--text-3)' : hov ? 'var(--cyan)' : 'var(--text-2)',
        fontSize: '0.88rem', fontWeight: active ? 700 : 500, fontFamily: 'inherit',
        transition: 'all 0.2s', opacity: disabled ? 0.4 : 1,
        boxShadow: active ? '0 4px 14px rgba(0,212,255,0.25)' : 'none',
      }}
    >
      {label}
    </button>
  );
}
