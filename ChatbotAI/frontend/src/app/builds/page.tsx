'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { cartApi } from '@/services/conference.api';
import { resolveProductImage } from '@/lib/product-image';

interface Build {
  id: string;
  name: string;
  category: 'gaming' | 'office' | 'streaming' | 'creative';
  price: number;
  stock: number;
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    psu: string;
  };
  description: string;
  performance: string;
  badge?: string;
  image?: string;
}

const BuildsPage = () => {
  const router = useRouter();
  const { user, cart, refreshCart } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [actionMessage, setActionMessage] = useState('');
  const [builds, setBuilds] = useState<Build[]>([
    {
      id: '1',
      name: 'Gaming Cơ Bản',
      category: 'gaming',
      image: '/images/case-nzxt-h7-flow.jpg',
      price: 12000000,
      stock: 12,
      specs: {
        cpu: 'Intel Core i3-12100F',
        gpu: 'RTX 1650 4GB',
        ram: '8GB DDR4',
        storage: 'SSD 256GB',
        psu: '450W 80+ Bronze',
      },
      description: 'Cấu hình tối ưu cho game casual và esports',
      performance: 'Phù hợp với game 1080p 60fps',
      badge: 'Phổ Biến',
    },
    {
      id: '2',
      name: 'Gaming Pro',
      category: 'gaming',
      image: '/images/case-nzxt-h5.jpg',
      price: 18500000,
      stock: 9,
      specs: {
        cpu: 'Intel Core i5-12400F',
        gpu: 'RTX 3060 12GB',
        ram: '16GB DDR4',
        storage: 'SSD 512GB',
        psu: '650W 80+ Gold',
      },
      description: 'Cấu hình chuyên dụng cho game AAA',
      performance: 'Chạy game 1440p 100+ fps',
      badge: 'Bán Chạy',
    },
    {
      id: '3',
      name: 'Gaming Siêu Cấp',
      category: 'gaming',
      image: '/images/case-phanteks-g360a.jpg',
      price: 35000000,
      stock: 6,
      specs: {
        cpu: 'Intel Core i7-12700K',
        gpu: 'RTX 4070 12GB',
        ram: '32GB DDR4',
        storage: 'SSD 1TB NVMe',
        psu: '850W 80+ Platinum',
      },
      description: 'Cấu hình top tier cho gaming đỉnh cao',
      performance: '4K 120fps hoặc 1440p 240fps',
      badge: 'Cao Cấp',
    },
    {
      id: '4',
      name: 'PC Văn Phòng',
      category: 'office',
      price: 9500000,
      stock: 15,
      specs: {
        cpu: 'AMD Ryzen 5 5500',
        gpu: 'Integrated Radeon',
        ram: '16GB DDR4',
        storage: 'SSD 512GB',
        psu: '400W 80+ Bronze',
      },
      description: 'Cấu hình lý tưởng cho công việc văn phòng',
      performance: 'Xử lý đa tác vụ mượt mà',
      badge: 'Tiết Kiệm',
    },
    {
      id: '5',
      name: 'Streaming Setup',
      category: 'streaming',
      price: 28000000,
      stock: 7,
      specs: {
        cpu: 'Intel Core i7-12700KF',
        gpu: 'RTX 3080 10GB',
        ram: '32GB DDR4',
        storage: 'SSD 2TB NVMe',
        psu: '850W 80+ Platinum',
      },
      description: 'Tối ưu cho live streaming 4K',
      performance: 'Stream 4K 60fps + gaming 1440p 100fps',
    },
    {
      id: '6',
      name: 'Creative Workstation',
      category: 'creative',
      price: 42000000,
      stock: 4,
      specs: {
        cpu: 'Intel Core i9-12900KF',
        gpu: 'RTX 4090 24GB',
        ram: '64GB DDR4',
        storage: 'SSD 2TB NVMe + HDD 4TB',
        psu: '1000W 80+ Platinum',
      },
      description: 'Workstation cho video editing, 3D rendering',
      performance: 'Xử lý 8K video, 3D rendering tối ưu',
    },
  ]);

  const [editingBuild, setEditingBuild] = useState<Build | null>(null);
  const [showForm, setShowForm] = useState(false);

  const categories = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'gaming', label: '🎮 Gaming' },
    { id: 'office', label: '💼 Văn Phòng' },
    { id: 'streaming', label: '📹 Streaming' },
    { id: 'creative', label: '🎨 Creative' },
  ];

  const filteredBuilds = selectedCategory === 'all' 
    ? builds 
    : builds.filter(b => b.category === selectedCategory);

  const handleAddBuild = (newBuild: Build) => {
    if (editingBuild) {
      setBuilds(builds.map(b => b.id === editingBuild.id ? { ...newBuild, id: editingBuild.id } : b));
      setEditingBuild(null);
    } else {
      setBuilds([...builds, { ...newBuild, id: Date.now().toString() }]);
    }
    setShowForm(false);
  };

  const handleDeleteBuild = (id: string) => {
    setBuilds(builds.filter(b => b.id !== id));
  };

  const handleEditBuild = (build: Build) => {
    setEditingBuild(build);
    setShowForm(true);
  };

  const handleAddToCart = async (build: Build) => {
    if (!user) {
      setActionMessage('Vui lòng đăng nhập để thêm build vào giỏ hàng của hệ thống.');
      router.push('/login');
      return;
    }

    const nextItems = [...cart.items];
    const productId = `build-${build.id}`;
    const existing = nextItems.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + 1, build.stock);
    } else {
      nextItems.push({
        productId,
        name: build.name,
        category: 'prebuilt',
        brand: 'PC Builder Shop',
        price: build.price,
        discountPrice: undefined,
        image: resolveProductImage(build.image ?? null, 'prebuilt'),
        quantity: 1,
        maxStock: build.stock,
      } as any);
    }

    await cartApi.updateItems(nextItems as any[]);
    await refreshCart();
    setActionMessage(`${build.name} đã được thêm vào giỏ hàng hệ thống.`);
  };

  /* ---- tier styling helpers ---- */
  const getTierStyle = (price: number): { label: string; color: string; bg: string; border: string; glow: string } => {
    if (price >= 30000000) return {
      label: '🏆 Gold',
      color: '#fbbf24',
      bg: 'rgba(251,191,36,0.08)',
      border: 'rgba(251,191,36,0.25)',
      glow: '0 0 20px rgba(251,191,36,0.1)',
    };
    if (price >= 15000000) return {
      label: '🥈 Silver',
      color: '#94a3b8',
      bg: 'rgba(148,163,184,0.08)',
      border: 'rgba(148,163,184,0.2)',
      glow: '0 0 20px rgba(148,163,184,0.08)',
    };
    return {
      label: '🥉 Bronze',
      color: '#f97316',
      bg: 'rgba(249,115,22,0.08)',
      border: 'rgba(249,115,22,0.2)',
      glow: '0 0 20px rgba(249,115,22,0.08)',
    };
  };

  const specIcons: Record<string, string> = {
    cpu: '🧠',
    gpu: '🎮',
    ram: '💾',
    storage: '💿',
    psu: '⚡',
  };

  const specLabels: Record<string, string> = {
    cpu: 'CPU',
    gpu: 'GPU',
    ram: 'RAM',
    storage: 'Storage',
    psu: 'PSU',
  };

  const inputStyle: React.CSSProperties = {
    padding: '0.8rem 1rem',
    borderRadius: 'var(--r)',
    border: '1px solid var(--border-2)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '0.92rem',
    fontFamily: 'var(--font)',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.25s var(--ease)',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ===== BREADCRUMB ===== */}
      <div className="container" style={{ paddingTop: '1.25rem' }}>
        <nav className="breadcrumb">
          <Link href="/">Trang Chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--cyan)' }}>PC Build Sẵn</span>
        </nav>
      </div>

      {/* ===== HERO BANNER ===== */}
      <section
        style={{
          position: 'relative',
          padding: '3.5rem 0 3rem',
          overflow: 'hidden',
        }}
      >
        {/* ambient glows */}
        <div style={{
          position: 'absolute', top: '-50%', left: '10%', width: '40%', height: '140%',
          background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '-30%', right: '5%', width: '35%', height: '120%',
          background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '40%', width: '30%', height: '80%',
          background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gap: '1rem', maxWidth: 780 }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                width: 'fit-content', padding: '0.45rem 1rem', borderRadius: 999,
                background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(168,85,247,0.12))',
                border: '1px solid var(--border-2)',
                color: 'var(--cyan)', fontWeight: 700, fontSize: '0.82rem',
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}
            >
              🎮 PC BUILD SẴN
            </span>

            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                lineHeight: 1.12,
              }}
            >
              <span className="gradient-text">PC Build Sẵn</span>{' '}
              <span style={{ color: 'var(--text)' }}>— Chọn & Game Ngay</span>
            </h1>

            <p style={{ color: 'var(--text-2)', fontSize: '1.08rem', margin: 0, maxWidth: 580, lineHeight: 1.6 }}>
              Chọn cấu hình hoàn chỉnh theo nhu cầu của bạn — từ gaming casual đến workstation chuyên nghiệp.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <div
                style={{
                  padding: '0.6rem 1.1rem', borderRadius: 999,
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  color: 'var(--text)', fontWeight: 600, fontSize: '0.9rem',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                }}
              >
                🛒 <span style={{ color: 'var(--cyan)', fontWeight: 800 }}>{cart.totalItems}</span> sản phẩm trong giỏ
              </div>
              <button
                type="button"
                onClick={() => router.push('/cart')}
                className="btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                Xem Giỏ Hàng →
              </button>
            </div>

            {actionMessage && (
              <div
                style={{
                  padding: '0.75rem 1.1rem', borderRadius: 'var(--r)',
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                  color: 'var(--green)', fontWeight: 600, width: 'fit-content',
                  display: 'flex', alignItems: 'center', gap: '0.45rem',
                }}
              >
                ✅ {actionMessage}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section style={{ padding: '0 0 3.5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Filter tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '0.55rem 1.15rem',
                      borderRadius: 999,
                      border: selectedCategory === cat.id ? '1px solid var(--cyan)' : '1px solid var(--border)',
                      background: selectedCategory === cat.id
                        ? 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(168,85,247,0.10))'
                        : 'var(--surface)',
                      color: selectedCategory === cat.id ? 'var(--cyan)' : 'var(--text-2)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.25s var(--ease)',
                      fontSize: '0.88rem',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div
                style={{
                  padding: '0.55rem 1rem', borderRadius: 999,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  color: 'var(--text-3)', fontWeight: 500, fontSize: '0.85rem',
                }}
              >
                🔥 {filteredBuilds.length} cấu hình sẵn sàng
              </div>
            </div>

            {/* Admin notice */}
            {showForm && (
              <div
                style={{
                  padding: '1rem 1.2rem', borderRadius: 'var(--r)',
                  background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.18)',
                  color: 'var(--purple)', fontWeight: 600, fontSize: '0.9rem',
                }}
              >
                💡 Chế độ quản trị đã được chuyển sang khu vực admin.
              </div>
            )}

            {/* Builds Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {filteredBuilds.map(build => {
                const tier = getTierStyle(build.price);
                return (
                  <div
                    key={build.id}
                    className="glass-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0',
                      padding: 0,
                      borderRadius: 'var(--r-lg)',
                      overflow: 'hidden',
                      transition: 'transform 0.35s var(--ease), box-shadow 0.35s var(--ease), border-color 0.35s var(--ease)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = `var(--shadow-lg), ${tier.glow}`;
                      (e.currentTarget as HTMLElement).style.borderColor = tier.border;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    }}
                  >
                    <div style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(168,85,247,0.06))', borderBottom: '1px solid var(--border)' }}>
                      <img
                        src={resolveProductImage(build.image ?? null, 'prebuilt')}
                        alt={build.name}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scale(1.01)' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(5,13,26,0.7) 100%)', pointerEvents: 'none' }} />
                      {build.badge && (
                        <span style={{ position: 'absolute', top: 12, left: 12, padding: '0.3rem 0.65rem', borderRadius: 999, background: 'rgba(5,13,26,0.8)', color: '#fff', fontSize: '0.72rem', fontWeight: 800, border: '1px solid rgba(255,255,255,0.12)' }}>{build.badge}</span>
                      )}
                    </div>

                    {/* card header with tier indicator */}
                    <div
                      style={{
                        padding: '1.25rem 1.35rem 1rem',
                        borderBottom: `1px solid var(--border)`,
                        position: 'relative',
                      }}
                    >
                      {/* subtle tier gradient top bar */}
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                        background: `linear-gradient(90deg, ${tier.color}, transparent)`,
                        opacity: 0.6,
                      }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                            {build.badge && (
                              <span
                                style={{
                                  display: 'inline-block',
                                  background: 'var(--grad-brand)',
                                  color: '#fff',
                                  padding: '0.25rem 0.7rem',
                                  borderRadius: 999,
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  letterSpacing: '0.02em',
                                }}
                              >
                                {build.badge}
                              </span>
                            )}
                            <span
                              style={{
                                display: 'inline-block',
                                background: tier.bg,
                                border: `1px solid ${tier.border}`,
                                color: tier.color,
                                padding: '0.25rem 0.65rem',
                                borderRadius: 999,
                                fontSize: '0.72rem',
                                fontWeight: 700,
                              }}
                            >
                              {tier.label}
                            </span>
                          </div>
                          <h3
                            style={{
                              margin: 0, color: 'var(--text)',
                              fontFamily: 'var(--font-heading)', fontWeight: 700,
                              fontSize: '1.1rem',
                            }}
                          >
                            {build.name}
                          </h3>
                          <p style={{ margin: '0.2rem 0 0', color: 'var(--text-3)', fontSize: '0.8rem' }}>
                            📦 Còn {build.stock} bộ sẵn sàng giao
                          </p>
                        </div>
                      </div>

                      <p style={{ margin: '0.65rem 0 0', color: 'var(--text-2)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                        {build.description}
                      </p>
                    </div>

                    {/* specs section */}
                    <div
                      style={{
                        padding: '1rem 1.35rem',
                        background: 'var(--surface)',
                      }}
                    >
                      <p style={{ margin: '0 0 0.6rem', color: 'var(--text-3)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        📋 Cấu hình chi tiết
                      </p>
                      <div style={{ display: 'grid', gap: '0.4rem' }}>
                        {Object.entries(build.specs).map(([key, value]) => (
                          <div
                            key={key}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.55rem',
                              padding: '0.4rem 0.65rem', borderRadius: 'var(--r-sm)',
                              background: 'var(--surface-2)',
                              fontSize: '0.84rem',
                            }}
                          >
                            <span style={{ fontSize: '0.9rem', width: 22, textAlign: 'center' }}>
                              {specIcons[key] || '•'}
                            </span>
                            <span style={{ color: 'var(--text-3)', fontWeight: 600, minWidth: 48 }}>
                              {specLabels[key] || key}
                            </span>
                            <span style={{ color: 'var(--text)', fontWeight: 500 }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* performance badge */}
                    <div
                      style={{
                        padding: '0.7rem 1.35rem',
                        borderTop: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                          padding: '0.3rem 0.7rem', borderRadius: 999,
                          background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)',
                          color: 'var(--cyan)', fontSize: '0.78rem', fontWeight: 600,
                        }}
                      >
                        ⚡ {build.performance}
                      </span>
                    </div>

                    {/* price + add to cart */}
                    <div
                      style={{
                        padding: '1rem 1.35rem 1.25rem',
                        borderTop: '1px solid var(--border)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        gap: '0.75rem',
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, color: 'var(--text-3)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Tổng giá
                        </p>
                        <p
                          className="gradient-text"
                          style={{
                            margin: '0.1rem 0 0',
                            fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
                            fontWeight: 800,
                            fontFamily: 'var(--font-heading)',
                          }}
                        >
                          {new Intl.NumberFormat('vi-VN').format(build.price)}₫
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(build)}
                        className="btn-primary"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                          padding: '0.7rem 1.25rem', fontSize: '0.88rem',
                          whiteSpace: 'nowrap',
                          transition: 'transform 0.2s var(--ease), box-shadow 0.2s var(--ease)',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                          (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-cyan)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                        }}
                      >
                        🛒 Thêm Giỏ Hàng
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredBuilds.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-3)',
                background: 'var(--surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🖥️</div>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-2)', fontSize: '1.05rem' }}>
                  Không tìm thấy build nào
                </p>
                <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem' }}>
                  Hãy thử chọn danh mục khác để tìm cấu hình phù hợp.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== STATS & TRUST ROW ===== */}
      <section style={{ padding: '0 0 3rem' }}>
        <div className="container">
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {[
              { icon: '🛡️', label: 'Bảo Hành', value: '12 Tháng', desc: 'Chính hãng toàn bộ' },
              { icon: '🚚', label: 'Giao Hàng', value: 'Miễn Phí', desc: 'Nội thành HCM' },
              { icon: '🔧', label: 'Lắp Ráp', value: 'Chuyên Nghiệp', desc: 'Kỹ thuật viên cao cấp' },
              { icon: '💬', label: 'Hỗ Trợ', value: '24/7', desc: 'Tư vấn mọi lúc' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="stat-card"
                style={{
                  textAlign: 'center',
                  padding: '1.25rem 1rem',
                }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div className="gradient-text" style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  {stat.value}
                </div>
                <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.85rem', marginTop: '0.15rem' }}>
                  {stat.label}
                </div>
                <div style={{ color: 'var(--text-3)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const BuildForm = ({
  build,
  onSave,
  onCancel,
}: {
  build: Build | null;
  onSave: (build: Build) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Build>(
    build || {
      id: '',
      name: '',
      category: 'gaming',
      price: 0,
      stock: 0,
      specs: {
        cpu: '',
        gpu: '',
        ram: '',
        storage: '',
        psu: '',
      },
      description: '',
      performance: '',
    }
  );

  const handleChange = (field: string, value: any) => {
    if (field.startsWith('specs.')) {
      const specField = field.split('.')[1];
      setFormData({
        ...formData,
        specs: { ...formData.specs, [specField]: value },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: '0.8rem 1rem',
    borderRadius: 'var(--r)',
    border: '1px solid var(--border-2)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '0.92rem',
    fontFamily: 'var(--font)',
    outline: 'none',
    width: '100%',
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.75rem',
        marginBottom: '1.5rem',
        borderRadius: 'var(--r-xl)',
      }}
    >
      <h3 style={{ color: 'var(--text)', marginTop: 0, fontFamily: 'var(--font-heading)', fontSize: '1.15rem' }}>
        {build ? '✏️ Chỉnh Sửa Build' : '➕ Thêm Build Mới'}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
        <input
          type="text"
          placeholder="Tên build"
          value={formData.name}
          onChange={e => handleChange('name', e.target.value)}
          style={inputStyle}
        />
        <select
          value={formData.category}
          onChange={e => handleChange('category', e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          <option value="gaming">Gaming</option>
          <option value="office">Văn Phòng</option>
          <option value="streaming">Streaming</option>
          <option value="creative">Creative</option>
        </select>
        <input
          type="number"
          placeholder="Giá (VNĐ)"
          value={formData.price}
          onChange={e => handleChange('price', Number(e.target.value))}
          style={inputStyle}
        />
        <input
          type="number"
          min={0}
          placeholder="Tồn kho"
          value={formData.stock}
          onChange={e => handleChange('stock', Number(e.target.value))}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Mô tả hiệu năng"
          value={formData.performance}
          onChange={e => handleChange('performance', e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Mô tả chi tiết"
          value={formData.description}
          onChange={e => handleChange('description', e.target.value)}
          style={{ ...inputStyle, gridColumn: '1 / -1', resize: 'vertical' as any }}
          rows={2}
        />
        <input
          type="text"
          placeholder="CPU"
          value={formData.specs.cpu}
          onChange={e => handleChange('specs.cpu', e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="GPU"
          value={formData.specs.gpu}
          onChange={e => handleChange('specs.gpu', e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="RAM"
          value={formData.specs.ram}
          onChange={e => handleChange('specs.ram', e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Storage"
          value={formData.specs.storage}
          onChange={e => handleChange('specs.storage', e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="PSU"
          value={formData.specs.psu}
          onChange={e => handleChange('specs.psu', e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
        <button
          type="button"
          onClick={() => onSave(formData)}
          className="btn-primary"
          style={{ padding: '0.8rem 1.5rem' }}
        >
          ✅ Lưu Build
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-ghost"
          style={{ padding: '0.8rem 1.5rem' }}
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default BuildsPage;
