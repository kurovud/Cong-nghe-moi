'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/product.type';
import { resolveProductImage } from '@/lib/product-image';

interface Props {
  initialCategory?: string;
  initialQuery?: string;
}

export default function ProductsClient({ initialCategory, initialQuery }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory ?? 'all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery ?? '');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { id: 'all', name: '🛒 Tất cả sản phẩm', icon: '🛒' },
    { id: 'cpu', name: '💻 CPU', icon: '💻' },
    { id: 'gpu', name: '🎮 GPU', icon: '🎮' },
    { id: 'mainboard', name: '⚡ Mainboard', icon: '⚡' },
    { id: 'ram', name: '🧠 RAM', icon: '🧠' },
    { id: 'ssd', name: '💾 SSD', icon: '💾' },
    { id: 'hdd', name: '📀 HDD', icon: '📀' },
    { id: 'case', name: '🖥️ Case', icon: '🖥️' },
    { id: 'psu', name: '⚙️ PSU', icon: '⚙️' },
    { id: 'cooler', name: '🌡️ Tản nhiệt', icon: '🌡️' },
    { id: 'monitor', name: '🖥️ Màn hình', icon: '🖥️' },
    { id: 'keyboard', name: '⌨️ Bàn phím', icon: '⌨️' },
    { id: 'mouse', name: '🖱️ Chuột', icon: '🖱️' },
    { id: 'headset', name: '🎧 Tai nghe', icon: '🎧' },
    { id: 'laptop', name: '💻 Laptop', icon: '💻' },
    { id: 'prebuilt', name: '🧩 PC nguyên bộ', icon: '🧩' },
  ];

  const priceRanges = [
    { id: 'all', label: 'Tất cả giá' },
    { id: '0-5m', label: 'Dưới 5 triệu' },
    { id: '5-10m', label: '5 - 10 triệu' },
    { id: '10-20m', label: '10 - 20 triệu' },
    { id: '20m+', label: 'Trên 20 triệu' },
  ];

  useEffect(() => {
    if (initialCategory && categories.some((c) => c.id === initialCategory)) {
      setSelectedCategory(initialCategory);
    }
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialCategory, initialQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=999');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products.slice();

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category?.toLowerCase().includes(selectedCategory));
    }

    if (searchQuery) {
      filtered = filtered.filter((p) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedPrice !== 'all') {
      switch (selectedPrice) {
        case '0-5m':
          filtered = filtered.filter((p) => Number(p.price ?? 0) < 5000000);
          break;
        case '5-10m':
          filtered = filtered.filter(
            (p) => Number(p.price ?? 0) >= 5000000 && Number(p.price ?? 0) < 10000000
          );
          break;
        case '10-20m':
          filtered = filtered.filter(
            (p) => Number(p.price ?? 0) >= 10000000 && Number(p.price ?? 0) < 20000000
          );
          break;
        case '20m+':
          filtered = filtered.filter((p) => Number(p.price ?? 0) >= 20000000);
          break;
      }
    }

    switch (sortBy) {
      case 'price-low':
        filtered = filtered.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0));
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedPrice, searchQuery, sortBy]);

  return (
    <div className="products-page products-page--neon">
      <section className="products-hero">
        <div className="container">
          <h1 className="products-hero-title">🛍️ TẤT CẢ SẢN PHẨM</h1>
          <p className="products-hero-desc">Kho hàng {products.length} sản phẩm - Cập nhật liên tục</p>
        </div>
      </section>

      <div className="container">
        <div className="products-layout">
          <aside className="products-sidebar">
            <div className="filter-group">
              <h3 className="filter-title">📂 Danh mục</h3>
              <div className="filter-options">
                {categories.map((cat) => (
                  <button type="button"
                    key={cat.id}
                    className={"filter-option " + (selectedCategory === cat.id ? 'active' : '')}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span className="filter-icon">{cat.icon}</span>
                    <span>{cat.name.split(' ').slice(1).join(' ')}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">💰 Giá</h3>
              <div className="filter-options">
                {priceRanges.map((range) => (
                  <button type="button"
                    key={range.id}
                    className={"filter-option " + (selectedPrice === range.id ? 'active' : '')}
                    onClick={() => setSelectedPrice(range.id)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="products-main">
            <div className="products-toolbar">
              <div className="search-mini">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-mini-input"
                />
              </div>

              <div className="sort-control">
                <label>Sắp xếp:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá: Thấp → Cao</option>
                  <option value="price-high">Giá: Cao → Thấp</option>
                </select>
              </div>

              <div className="product-count">{filteredProducts.length} sản phẩm</div>
            </div>

            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={'/products/' + (product.category || 'cpu') + '/' + product.id}
                    className="product-item"
                  >
                    <div className="product-item-image">
                      <img
                        src={resolveProductImage(product.image, product.category)}
                        alt={product.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = resolveProductImage(null);
                        }}
                      />
                    </div>
                    <div className="product-item-info">
                      <h3 className="product-item-name">{product.name}</h3>
                      <p className="product-item-category">{product.category}</p>
                      <p className="product-item-price">{Number(product.price ?? 0).toLocaleString('vi-VN')} ₫</p>
                      <button type="button" className="product-item-btn">Xem Chi Tiết</button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="no-products">
                  <p>❌ Không tìm thấy sản phẩm nào</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
