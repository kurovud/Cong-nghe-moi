'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { cartApi } from '@/services/conference.api';
import ChatDemo from '@/components/home/ChatDemo';

/* ── Data ── */
const featuredDeals = [
  {
    name: 'PC Gaming i5 12400F - RTX 5060',
    price: '23.480.000',
    original: '24.990.000',
    discount: '-6%',
    status: 'Còn hàng',
    brand: 'INTEL',
    icon: '🖥️',
    bgColor: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(168,85,247,0.08))',
    rating: 4.8,
    reviews: 142,
    stock: 8,
  },
  {
    name: 'PC AMD Ryzen 7 5700X - RTX 3050',
    price: '16.280.000',
    original: '17.990.000',
    discount: '-10%',
    status: 'Còn hàng',
    brand: 'AMD',
    icon: '🎮',
    bgColor: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(168,85,247,0.08))',
    rating: 4.7,
    reviews: 89,
    stock: 14,
  },
  {
    name: 'PC Gaming i5 12400F - RTX 3050',
    price: '16.980.000',
    original: '18.990.000',
    discount: '-11%',
    status: 'Còn hàng',
    brand: 'INTEL',
    icon: '⚡',
    bgColor: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(0,212,255,0.08))',
    rating: 4.6,
    reviews: 67,
    stock: 5,
  },
  {
    name: 'PC Gaming i5 14400F - RTX 5060 Ti',
    price: '29.480.000',
    original: '30.990.000',
    discount: '-5%',
    status: 'Còn hàng',
    brand: 'INTEL',
    icon: '🚀',
    bgColor: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(0,212,255,0.08))',
    rating: 4.9,
    reviews: 203,
    stock: 3,
  },
];

const hotProducts = [
  {
    name: 'NVIDIA GeForce RTX 4090 24GB',
    brand: 'NVIDIA',
    icon: '🎮',
    price: '42.000.000',
    original: '45.000.000',
    rating: 4.9,
    reviews: 312,
    bgColor: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(168,85,247,0.15))',
    badge: 'HOT',
    stock: 4,
  },
  {
    name: 'Intel Core i9-14900K Box',
    brand: 'INTEL',
    icon: '💻',
    price: '18.500.000',
    original: '20.000.000',
    rating: 4.8,
    reviews: 178,
    bgColor: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(0,212,255,0.08))',
    badge: 'MỚI',
    stock: 12,
  },
  {
    name: 'AMD Ryzen 9 7950X Tray',
    brand: 'AMD',
    icon: '🧠',
    price: '22.000.000',
    original: '24.500.000',
    rating: 4.9,
    reviews: 256,
    bgColor: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(249,115,22,0.08))',
    badge: 'HOT',
    stock: 7,
  },
  {
    name: 'ASUS ROG Maximus Z790 Apex',
    brand: 'ASUS',
    icon: '⚡',
    price: '15.800.000',
    original: '16.500.000',
    rating: 4.7,
    reviews: 94,
    bgColor: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(0,212,255,0.08))',
    badge: 'SALE',
    stock: 6,
  },
];

const categories = [
  { id: 'cpu', name: 'CPU', icon: '💻', count: '250+', gradient: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.04))' },
  { id: 'gpu', name: 'GPU / VGA', icon: '🎮', count: '180+', gradient: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.04))' },
  { id: 'mainboard', name: 'Mainboard', icon: '⚡', count: '120+', gradient: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.04))' },
  { id: 'ram', name: 'RAM', icon: '🧠', count: '90+', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))' },
  { id: 'ssd', name: 'SSD / HDD', icon: '💾', count: '150+', gradient: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(59,130,246,0.06))' },
  { id: 'cooler', name: 'Tản Nhiệt', icon: '❄️', count: '80+', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(0,212,255,0.04))' },
  { id: 'case', name: 'Case / Vỏ', icon: '🖥️', count: '100+', gradient: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(249,115,22,0.06))' },
  { id: 'psu', name: 'PSU / Nguồn', icon: '🔌', count: '60+', gradient: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(239,68,68,0.06))' },
];

const testimonials = [
  {
    name: 'Nguyễn Minh Tuấn',
    role: 'Game thủ chuyên nghiệp',
    text: 'Tư vấn rất nhiệt tình, giá cả cạnh tranh, giao hàng nhanh. PC build của mình chạy ổn định cả năm nay không một lỗi nhỏ. Sẽ tiếp tục ủng hộ!',
    stars: 5,
    avatar: 'MT',
  },
  {
    name: 'Trần Thị Lan Anh',
    role: 'Sinh viên CNTT',
    text: 'ChatBot AI của shop thực sự hữu ích! Tư vấn được cấu hình phù hợp với ngân sách của mình. Màn hình và chuột đặt về rất đẹp, đóng gói cẩn thận.',
    stars: 5,
    avatar: 'LA',
  },
  {
    name: 'Lê Văn Đức',
    role: 'Designer / Streamer',
    text: 'Workstation mình build ở đây cực kỳ mạnh cho render video 4K. Đội kỹ thuật lắp ráp chuyên nghiệp, hướng dẫn tận tình. Highly recommend!',
    stars: 5,
    avatar: 'ĐK',
  },
];

const brands1 = ['⚡ INTEL', '🟢 NVIDIA', '🔴 AMD', '🟡 ASUS ROG', '🔵 MSI', '🟠 GIGABYTE', '🔷 CORSAIR', '🟤 be quiet!'];
const brands2 = ['💜 SAMSUNG', '🔴 WESTERN DIGITAL', '🟠 SEAGATE', '⚫ NZXT', '🔵 COOLER MASTER', '🟡 THERMALTAKE', '⚪ FRACTAL', '🟣 LIAN LI'];

/* ── Countdown Hook ── */
function useCountdown(hours = 23, minutes = 45, seconds = 12) {
  const [time, setTime] = useState({ h: hours, m: minutes, s: seconds });
  useEffect(() => {
    const id = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 23, m: 59, s: 59 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const HomePage = () => {
  const router = useRouter();
  const { user, cart, refreshCart } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [addMessage, setAddMessage] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);
  const countdown = useCountdown(23, 45, 12);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) { router.push('/products'); return; }
    router.push('/products?q=' + encodeURIComponent(query));
  };

  const handleAddToCart = async (product: typeof featuredDeals[0]) => {
    if (!user) {
      setAddMessage('Vui lòng đăng nhập để thêm vào giỏ hàng');
      router.push('/login');
      return;
    }
    try {
      const nextItems = [...cart.items];
      const productId = `deal-${product.name.replace(/\s+/g, '-').toLowerCase()}`;
      const existing = nextItems.find((item) => item.productId === productId);
      const priceValue = parseInt(product.price.replace(/\./g, ''));
      if (existing) { existing.quantity = existing.quantity + 1; }
      else {
        nextItems.push({
          productId,
          name: product.name,
          category: 'prebuilt',
          brand: 'PC Builder Shop',
          price: priceValue,
          discountPrice: undefined,
          image: undefined,
          quantity: 1,
          maxStock: 100,
        } as any);
      }
      await cartApi.updateItems(nextItems as any[]);
      await refreshCart();
      setAddMessage(`${product.name} đã được thêm vào giỏ hàng!`);
      setTimeout(() => setAddMessage(''), 3000);
    } catch {
      setAddMessage('Lỗi khi thêm vào giỏ hàng.');
    }
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div>
      {/* ===== TOP MARQUEE BAR ===== */}
      <div className="top-info-bar">
        <div style={{ overflow: 'hidden', width: '100%' }}>
          <div style={{
            display: 'flex', gap: '3rem',
            animation: 'marquee 30s linear infinite',
            width: 'max-content', alignItems: 'center',
          }}>
            {[
              '🚚 Miễn phí vận chuyển đơn từ 5 triệu',
              '🛡️ Bảo hành 24 tháng chính hãng',
              '🔄 Đổi trả 7 ngày không cần lý do',
              '🎧 Hỗ trợ kỹ thuật 24/7',
              '💳 Trả góp 0% lãi suất',
              '⭐ Hơn 50.000 khách hàng hài lòng',
              '🏪 Showroom tại TP.HCM & Hà Nội',
              '🤖 Tư vấn AI miễn phí 24/7',
              '🚚 Miễn phí vận chuyển đơn từ 5 triệu',
              '🛡️ Bảo hành 24 tháng chính hãng',
              '🔄 Đổi trả 7 ngày không cần lý do',
              '🎧 Hỗ trợ kỹ thuật 24/7',
              '💳 Trả góp 0% lãi suất',
              '⭐ Hơn 50.000 khách hàng hài lòng',
              '🏪 Showroom tại TP.HCM & Hà Nội',
              '🤖 Tư vấn AI miễn phí 24/7',
            ].map((item, i) => (
              <a key={i} className="top-info-link" href="#" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-bg-grid" />
          <div className="hero-bg-orb-1" />
          <div className="hero-bg-orb-2" />
          <div style={{
            position: 'absolute', top: '60%', left: '50%',
            width: '280px', height: '280px',
            background: 'radial-gradient(circle, rgba(249,115,22,0.06), transparent 70%)',
            borderRadius: '50%', animation: 'float 14s ease-in-out infinite',
            transform: 'translateX(-50%)', pointerEvents: 'none',
          }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-2col">
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Badge */}
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 1rem', borderRadius: '999px',
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(168,85,247,0.12))',
                  border: '1px solid rgba(0,212,255,0.25)',
                  color: 'var(--cyan)', fontWeight: 700, fontSize: '0.75rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                  ✦ PREMIUM GAMING GEAR
                </span>
              </div>

              {/* H1 */}
              <div>
                <h1 className="hero-title" style={{ marginBottom: '0.75rem' }}>
                  <span className="gradient-text">PC Builder</span>{' '}
                  <span style={{ color: 'var(--text)' }}>Shop</span>
                  <br />
                  <span style={{
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)',
                    color: 'var(--text-2)', fontWeight: 500,
                    background: 'none', WebkitTextFillColor: 'unset',
                  }}>
                    Nơi Đỉnh Cao Gặp Đam Mê
                  </span>
                </h1>
                <p style={{
                  color: 'var(--text-2)', fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
                  lineHeight: 1.7, maxWidth: 500,
                }}>
                  Linh kiện PC chính hãng · PC build sẵn cao cấp · Tư vấn AI thông minh 24/7.
                  Trải nghiệm mua sắm gaming đỉnh nhất Việt Nam.
                </p>
              </div>

              {/* Search */}
              <div className="search-box-container">
                <form className="search-box" onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Tìm CPU, GPU, RAM, Mainboard, SSD..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <button className="search-btn" type="submit" aria-label="Tìm kiếm">
                    <span>🔍</span>
                  </button>
                </form>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/products" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
                  🛒 Khám Phá Ngay
                </Link>
                <Link href="/chat" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.9rem 1.8rem', borderRadius: 'var(--r-lg)',
                  border: '1.5px solid rgba(0,212,255,0.4)',
                  color: 'var(--cyan)', fontWeight: 600, fontSize: '1rem',
                  transition: 'all 0.25s',
                  background: 'rgba(0,212,255,0.06)',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.12)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--cyan)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(0,212,255,0.2)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.06)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.4)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  🤖 Tư Vấn AI
                </Link>
              </div>

              {/* Category Quick Nav */}
              <div className="category-quick-nav">
                {[
                  { href: '/products/cpu', icon: '💻', label: 'CPU' },
                  { href: '/products/gpu', icon: '🎮', label: 'GPU' },
                  { href: '/products/ram', icon: '🧠', label: 'RAM' },
                  { href: '/products/ssd', icon: '💾', label: 'SSD' },
                  { href: '/products/cooler', icon: '❄️', label: 'Tản Nhiệt' },
                  { href: '/products/case', icon: '🖥️', label: 'Case' },
                ].map((c) => (
                  <a key={c.href} href={c.href} className="nav-category">
                    <span className="category-icon">{c.icon}</span>
                    <span>{c.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Right Column — Hero Visual */}
            <div className="hero-right-visual">
              <div style={{ position: 'relative', width: '100%', maxWidth: 420 }}>
                {/* Main PC card */}
                <div className="hero-pc-card">
                  <span className="hero-floating-badge">🔥 RTX 4090 EDITION</span>

                  <div className="hero-pc-card__icon-wrap">🖥️</div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      fontSize: '0.75rem', fontWeight: 700,
                      color: 'var(--cyan)', textTransform: 'uppercase',
                      letterSpacing: '0.08em', marginBottom: '0.3rem',
                    }}>
                      🏆 Gaming Siêu Cấp — Top Config
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-heading)', fontWeight: 800,
                      fontSize: '1.15rem', color: 'var(--text)', lineHeight: 1.3,
                    }}>
                      Ultimate Gaming Workstation
                    </div>
                  </div>

                  {[
                    { label: 'CPU', val: 'Intel Core i9-14900K' },
                    { label: 'GPU', val: 'RTX 4090 24GB GDDR6X' },
                    { label: 'RAM', val: '64GB DDR5 6000MHz' },
                    { label: 'Storage', val: '2TB NVMe Gen5 SSD' },
                  ].map(spec => (
                    <div key={spec.label} className="hero-pc-card__spec">
                      <span className="hero-pc-card__spec-label">{spec.label}</span>
                      <span className="hero-pc-card__spec-val">{spec.val}</span>
                    </div>
                  ))}

                  <div style={{
                    marginTop: '1.25rem', padding: '0.85rem',
                    background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--r)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Chỉ từ</div>
                      <div style={{
                        fontFamily: 'var(--font-heading)', fontWeight: 900,
                        fontSize: '1.3rem', background: 'var(--grad-brand)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      }}>
                        35.000.000₫
                      </div>
                    </div>
                    <Link href="/builds" style={{
                      padding: '0.55rem 1.1rem', background: 'var(--grad-brand)',
                      borderRadius: 'var(--r-sm)', color: '#fff', fontWeight: 700,
                      fontSize: '0.82rem', display: 'inline-block',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: '0 4px 16px rgba(0,212,255,0.3)',
                    }}>
                      Xem ngay →
                    </Link>
                  </div>
                </div>

                {/* Floating stats */}
                <div style={{
                  position: 'absolute', bottom: '-16px', left: '-16px',
                  background: 'rgba(8,15,30,0.92)', border: '1px solid var(--border-2)',
                  borderRadius: 'var(--r-lg)', padding: '0.85rem 1.1rem',
                  backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow-md)',
                  display: 'flex', alignItems: 'center', gap: '0.65rem',
                }}>
                  <div style={{ fontSize: '1.5rem' }}>⭐</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: '#fbbf24' }}>4.9 / 5.0</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>50K+ đánh giá</div>
                  </div>
                </div>

                <div style={{
                  position: 'absolute', top: '-16px', left: '-20px',
                  background: 'rgba(8,15,30,0.92)', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 'var(--r-lg)', padding: '0.75rem 1rem',
                  backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow-md)',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--green)',
                    boxShadow: '0 0 8px rgba(16,185,129,0.6)',
                    animation: 'glow-pulse 2s ease-in-out infinite',
                  }} />
                  <div style={{ fontSize: '0.75rem', color: 'var(--green)', fontWeight: 700 }}>
                    Online ngay bây giờ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <div className="trust-bar">
        {[
          { icon: '🚚', title: 'Miễn Phí Vận Chuyển', sub: 'Đơn hàng từ 5 triệu đồng' },
          { icon: '🛡️', title: 'Bảo Hành 24 Tháng', sub: 'Chính hãng toàn bộ linh kiện' },
          { icon: '🔄', title: 'Đổi Trả 7 Ngày', sub: 'Không cần lý do, hoàn tiền 100%' },
          { icon: '🎧', title: 'Hỗ Trợ 24/7', sub: 'Kỹ thuật viên chuyên nghiệp' },
        ].map((item) => (
          <div key={item.title} className="trust-item">
            <div className="trust-item__icon">{item.icon}</div>
            <div>
              <div className="trust-item__title">{item.title}</div>
              <div className="trust-item__sub">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== STATS BAR ===== */}
      <div className="stats-bar-v2 container" style={{ borderRadius: 0 }}>
        {[
          { icon: '📦', value: '10.000+', label: 'Sản phẩm chính hãng', color: 'var(--cyan)' },
          { icon: '👥', value: '50.000+', label: 'Khách hàng hài lòng', color: 'var(--purple)' },
          { icon: '⭐', value: '4.9 ★', label: 'Điểm đánh giá TB', color: '#fbbf24' },
          { icon: '🔧', value: '5 năm', label: 'Kinh nghiệm phục vụ', color: 'var(--orange)' },
        ].map((stat) => (
          <div key={stat.label} className="stat-item">
            <div className="stat-item__icon">{stat.icon}</div>
            <div className="stat-item__value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="stat-item__label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ===== PROMO CARDS ===== */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div className="promo-grid-v2">
            <Link href="/products" className="promo-card-v2" style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(168,85,247,0.06) 100%)',
              borderColor: 'rgba(0,212,255,0.2)',
            }}>
              <span style={{
                display: 'inline-block', padding: '0.3rem 0.75rem',
                background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)',
                borderRadius: '999px', color: 'var(--orange)', fontSize: '0.7rem',
                fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: '0.85rem',
              }}>HOT DEAL</span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
                🖥️ PC GIÁ TỐT — LẮP SẴN NGAY
              </h3>
              <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Cấu hình mạnh · Giá hợp lý · Bảo hành 24 tháng chính hãng
              </p>
              <span style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: '0.9rem' }}>Xem tất cả →</span>
              <div className="promo-card-v2__bg-icon">🎯</div>
            </Link>

            <Link href="/builds" className="promo-card-v2" style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(0,212,255,0.04) 100%)',
              borderColor: 'rgba(168,85,247,0.2)',
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
                🎮 PC BUILD SẴN
              </h3>
              <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Chọn ngay · Chơi liền tay
              </p>
              <span style={{ color: 'var(--purple)', fontWeight: 700, fontSize: '0.85rem' }}>Khám phá →</span>
              <div className="promo-card-v2__bg-icon">🏆</div>
            </Link>

            <Link href="/chat" className="promo-card-v2" style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(168,85,247,0.04) 100%)',
              borderColor: 'rgba(249,115,22,0.2)',
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
                🤖 TƯ VẤN AI
              </h3>
              <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Miễn phí · 24/7 · Nhanh chóng
              </p>
              <span style={{ color: 'var(--orange)', fontWeight: 700, fontSize: '0.85rem' }}>Bắt đầu →</span>
              <div className="promo-card-v2__bg-icon">💬</div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FLASH SALE SECTION ===== */}
      <section style={{ padding: '0 0 4rem' }}>
        <div className="container">
          {/* Header */}
          <div className="flash-sale-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span className="flash-sale-label">⚡ FLASH SALE</span>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 800,
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--text)',
                  lineHeight: 1.2, margin: 0,
                }}>
                  DEAL HOT MỖI NGÀY —{' '}
                  <span className="gradient-text">GIÁ SỐC GIỚI HẠN</span>
                </h2>
              </div>
            </div>
            <div className="countdown">
              <div className="countdown__block">
                <span className="countdown__num">{pad(countdown.h)}</span>
                <span className="countdown__lbl">Giờ</span>
              </div>
              <span className="countdown__sep">:</span>
              <div className="countdown__block">
                <span className="countdown__num">{pad(countdown.m)}</span>
                <span className="countdown__lbl">Phút</span>
              </div>
              <span className="countdown__sep">:</span>
              <div className="countdown__block">
                <span className="countdown__num">{pad(countdown.s)}</span>
                <span className="countdown__lbl">Giây</span>
              </div>
            </div>
          </div>

          {addMessage && (
            <div style={{
              padding: '0.85rem 1.25rem',
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 'var(--r)', color: '#6ee7b7',
              marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              ✓ {addMessage}
            </div>
          )}

          {/* Product Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}>
            {featuredDeals.map((product, idx) => {
              const stockPct = Math.round((product.stock / 20) * 100);
              return (
                <div key={idx} className="pc-product-card">
                  {/* Image */}
                  <div className="pc-product-card__image" style={{ background: product.bgColor }}>
                    {product.icon}
                    <span className="pc-product-card__badge">{product.discount}</span>
                    <button
                      className="pc-product-card__wishlist"
                      onClick={e => e.stopPropagation()}
                      aria-label="Yêu thích"
                    >
                      ♡
                    </button>
                  </div>

                  {/* Body */}
                  <div className="pc-product-card__body">
                    <span className="pc-product-card__brand">{product.brand}</span>
                    <div className="pc-product-card__name">{product.name}</div>
                    <div className="pc-product-card__rating">
                      <span className="pc-product-card__stars">{'★'.repeat(Math.floor(product.rating))}</span>
                      <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>{product.rating}</span>
                      <span className="pc-product-card__rating-count">({product.reviews} đánh giá)</span>
                    </div>
                    <div className="pc-product-card__price-block">
                      <div className="pc-product-card__original">{product.original}₫</div>
                      <div className="pc-product-card__sale">{product.price}₫</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                        <span>Còn {product.stock} sản phẩm</span>
                        <span style={{ color: 'var(--orange)' }}>Sắp hết!</span>
                      </div>
                      <div className="pc-product-card__stock-bar">
                        <div className="pc-product-card__stock-fill" style={{ width: `${stockPct}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pc-product-card__footer">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddToCart(product)}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      🛒 Thêm giỏ hàng
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => router.push('/chat')}
                      style={{ padding: '0.5rem 0.75rem' }}
                      title="Hỏi AI"
                    >
                      🤖
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/products" className="btn btn-secondary btn-lg">
              Xem tất cả sản phẩm →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CATEGORY SHOWCASE ===== */}
      <section style={{ padding: '0 0 4rem' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">📦 Danh Mục Sản Phẩm</span>
            <h2 className="section-title">
              CHỌN ĐÚNG{' '}
              <span className="gradient-text">LINH KIỆN BẠN CẦN</span>
            </h2>
            <p className="section-desc">
              Hơn 10.000 sản phẩm chính hãng từ các thương hiệu hàng đầu thế giới
            </p>
          </div>

          <div className="category-card-grid">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products/${cat.id}`} className="cat-card" style={{ background: cat.gradient }}>
                <span className="cat-card__icon">{cat.icon}</span>
                <div className="cat-card__name">{cat.name}</div>
                <div className="cat-card__count">{cat.count} sản phẩm</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOT PRODUCTS ===== */}
      <section style={{ padding: '0 0 4rem' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">🔥 Nổi Bật</span>
            <h2 className="section-title">
              SẢN PHẨM{' '}
              <span className="gradient-text">NỔI BẬT NHẤT</span>
            </h2>
            <p className="section-desc">Được khách hàng tin tưởng lựa chọn nhiều nhất tháng này</p>
          </div>

          <div className="hot-products-grid">
            {hotProducts.map((product, idx) => {
              const stockPct = Math.round((product.stock / 20) * 100);
              const badgeColor = product.badge === 'HOT'
                ? 'linear-gradient(135deg, #ef4444, #f97316)'
                : product.badge === 'MỚI'
                  ? 'var(--grad-brand)'
                  : 'var(--grad-orange)';

              return (
                <div key={idx} className="pc-product-card">
                  <div className="pc-product-card__image" style={{ background: product.bgColor }}>
                    {product.icon}
                    <span className="pc-product-card__badge" style={{ background: badgeColor }}>
                      {product.badge}
                    </span>
                    <button className="pc-product-card__wishlist" onClick={e => e.stopPropagation()} aria-label="Yêu thích">
                      ♡
                    </button>
                  </div>
                  <div className="pc-product-card__body">
                    <span className="pc-product-card__brand">{product.brand}</span>
                    <div className="pc-product-card__name">{product.name}</div>
                    <div className="pc-product-card__rating">
                      <span className="pc-product-card__stars">{'★'.repeat(Math.floor(product.rating))}</span>
                      <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>{product.rating}</span>
                      <span className="pc-product-card__rating-count">({product.reviews})</span>
                    </div>
                    <div className="pc-product-card__price-block">
                      <div className="pc-product-card__original">{product.original}₫</div>
                      <div className="pc-product-card__sale">{product.price}₫</div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--green)', fontWeight: 600 }}>
                      ✓ Còn {product.stock} sản phẩm
                    </div>
                  </div>
                  <div className="pc-product-card__footer">
                    <button type="button" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                      🛒 Thêm giỏ hàng
                    </button>
                    <Link href="/chat" className="btn btn-ghost btn-sm" style={{ padding: '0.5rem 0.75rem' }} title="Hỏi AI">
                      🤖
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PC BUILDS SECTION ===== */}
      <section style={{
        padding: '4rem 0',
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.03) 50%, transparent 100%)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">🎮 PC Sẵn Sàng</span>
            <h2 className="section-title">
              PC BUILD{' '}
              <span className="gradient-text">CHỌN LÀ CHƠI</span>
            </h2>
            <p className="section-desc">
              Được lắp ráp và kiểm tra kỹ lưỡng bởi kỹ thuật viên chuyên nghiệp
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                name: 'Gaming Cơ Bản',
                specs: ['Intel Core i3-12100F', 'RTX 1650 4GB', '8GB DDR4', 'SSD 256GB', '450W Bronze'],
                price: '12.000.000',
                badge: '🥉 Phổ Biến',
                icon: '🖥️',
                color: 'var(--orange)',
                gradBg: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.04))',
                borderC: 'rgba(249,115,22,0.25)',
              },
              {
                name: 'Gaming Pro',
                specs: ['Intel Core i5-12400F', 'RTX 3060 12GB', '16GB DDR4', 'SSD 512GB', '650W Gold'],
                price: '18.500.000',
                badge: '🥈 Bán Chạy',
                icon: '🎮',
                color: '#94a3b8',
                gradBg: 'linear-gradient(135deg, rgba(148,163,184,0.1), rgba(148,163,184,0.04))',
                borderC: 'rgba(148,163,184,0.25)',
              },
              {
                name: 'Gaming Siêu Cấp',
                specs: ['Intel Core i7-12700K', 'RTX 4070 12GB', '32GB DDR5', 'SSD 1TB NVMe', '850W Platinum'],
                price: '35.000.000',
                badge: '🥇 Cao Cấp',
                icon: '⚡',
                color: '#fbbf24',
                gradBg: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,191,36,0.04))',
                borderC: 'rgba(251,191,36,0.3)',
              },
              {
                name: 'PC Văn Phòng',
                specs: ['AMD Ryzen 5 5500', 'Radeon iGPU', '16GB DDR4', 'SSD 512GB', '400W Bronze'],
                price: '9.500.000',
                badge: '💼 Tiết Kiệm',
                icon: '💼',
                color: 'var(--cyan)',
                gradBg: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,212,255,0.03))',
                borderC: 'rgba(0,212,255,0.2)',
              },
            ].map((build, idx) => (
              <div key={idx} style={{
                background: build.gradBg,
                border: `1px solid ${build.borderC}`,
                borderRadius: 'var(--r-xl)',
                overflow: 'hidden',
                transition: 'all 0.35s var(--ease)',
                display: 'flex', flexDirection: 'column',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 48px rgba(0,0,0,0.5), 0 0 30px ${build.borderC}`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {/* Top bar */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${build.color}, transparent)` }} />

                <div style={{ padding: '1.5rem 1.5rem 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <div style={{ fontSize: '2.5rem' }}>{build.icon}</div>
                    <span style={{
                      padding: '0.3rem 0.75rem',
                      background: `${build.borderC}`,
                      border: `1px solid ${build.borderC}`,
                      borderRadius: '999px',
                      fontSize: '0.72rem', fontWeight: 800,
                      color: build.color,
                    }}>
                      {build.badge}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text)', marginBottom: '1rem' }}>
                    {build.name}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {build.specs.map((spec, si) => (
                      <div key={si} style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        fontSize: '0.82rem', color: 'var(--text-2)',
                        padding: '0.35rem 0.65rem',
                        background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--r-sm)',
                      }}>
                        <span style={{ color: build.color, fontSize: '0.7rem' }}>▸</span>
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  padding: '1rem 1.5rem 1.5rem',
                  borderTop: '1px solid var(--border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 'auto',
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Từ</div>
                    <div style={{
                      fontFamily: 'var(--font-heading)', fontWeight: 900,
                      fontSize: '1.25rem', color: build.color,
                    }}>
                      {build.price}₫
                    </div>
                  </div>
                  <Link href="/builds" className="btn btn-primary btn-sm">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/builds" className="btn btn-secondary btn-lg">
              🎮 Xem Tất Cả PC Build →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">🛠️ Hỗ Trợ 360°</span>
            <h2 className="section-title">
              DỊCH VỤ{' '}
              <span className="gradient-text">CHUYÊN NGHIỆP</span>
            </h2>
            <p className="section-desc">
              Hỗ trợ toàn diện từ tư vấn đến bảo hành — cam kết trải nghiệm tốt nhất
            </p>
          </div>

          <div className="services-grid">
            {[
              { icon: '🔧', title: 'Lắp Ráp PC Miễn Phí', desc: 'Kỹ thuật viên lắp ráp chuyên nghiệp, test trước khi giao. Miễn phí với đơn từ 10 triệu.', color: 'var(--cyan)' },
              { icon: '🏠', title: 'Lắp Đặt Tại Nhà', desc: 'Hỗ trợ lắp đặt và cài đặt phần mềm tại địa chỉ của bạn. Nội thành TP.HCM & Hà Nội.', color: 'var(--purple)' },
              { icon: '💳', title: 'Trả Góp 0% Lãi Suất', desc: 'Phân kỳ 3-12 tháng 0% qua thẻ tín dụng. Hỗ trợ nhiều ngân hàng và ví điện tử.', color: 'var(--orange)' },
              { icon: '🔄', title: 'Thu Cũ Đổi Mới', desc: 'Thu mua linh kiện cũ với giá cạnh tranh. Định giá nhanh, thanh toán ngay tại showroom.', color: 'var(--green)' },
              { icon: '🤖', title: 'Tư Vấn AI 24/7', desc: 'Chatbot AI hiểu sâu về phần cứng PC, tư vấn cấu hình tối ưu theo ngân sách và nhu cầu.', color: 'var(--cyan)' },
              { icon: '🚚', title: 'Vận Chuyển Toàn Quốc', desc: 'Đóng gói cẩn thận, giao nhanh 2H nội thành, 2-5 ngày toàn quốc. Cam kết nguyên vẹn.', color: 'var(--purple)' },
            ].map((service, idx) => (
              <div key={idx} className="service-card"
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${service.color}40`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px rgba(0,0,0,0.4), 0 0 20px ${service.color}20`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div className="service-icon" style={{ color: service.color }}>{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/services" className="btn btn-secondary btn-lg">
              Xem Tất Cả Dịch Vụ →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BRAND MARQUEE ===== */}
      <div className="brand-marquee-section">
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <span className="section-label" style={{ margin: '0 auto' }}>🏆 Thương Hiệu Chính Hãng</span>
        </div>
        <div className="brand-marquee-row">
          <div className="brand-marquee-track brand-marquee-track--right">
            {[...brands1, ...brands1].map((b, i) => (
              <span key={i} className="brand-pill">{b}</span>
            ))}
          </div>
        </div>
        <div className="brand-marquee-row" style={{ marginTop: '0.75rem' }}>
          <div className="brand-marquee-track brand-marquee-track--left">
            {[...brands2, ...brands2].map((b, i) => (
              <span key={i} className="brand-pill">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== AI CHAT DEMO ===== */}
      <section style={{ padding: '4rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 70% 50%, rgba(168,85,247,0.07) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(0,212,255,0.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3.5rem', alignItems: 'center' }}>
            {/* Left */}
            <div>
              <span className="section-label">🤖 AI Assistant</span>
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800,
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--text)',
                lineHeight: 1.2, margin: '1rem 0',
              }}>
                TƯ VẤN{' '}
                <span className="gradient-text">THÔNG MINH</span>
                <br />
                BẰNG AI 24/7
              </h2>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '2rem' }}>
                AI của chúng tôi hiểu sâu về phần cứng PC, tư vấn cấu hình theo ngân sách, so sánh sản phẩm, và giải thích thông số kỹ thuật một cách dễ hiểu.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                {[
                  { icon: '🎯', text: 'Tư vấn cấu hình theo ngân sách' },
                  { icon: '⚖️', text: 'So sánh CPU/GPU chuyên sâu' },
                  { icon: '💡', text: 'Gợi ý upgrade hiệu quả nhất' },
                  { icon: '🔧', text: 'Hỗ trợ troubleshoot sự cố' },
                ].map((f) => (
                  <div key={f.text} style={{
                    display: 'flex', alignItems: 'center', gap: '0.85rem',
                    padding: '0.75rem 1rem',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--r)', fontSize: '0.88rem', color: 'var(--text-2)',
                    fontWeight: 500,
                  }}>
                    <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
                    {f.text}
                  </div>
                ))}
              </div>
              <Link href="/chat" className="btn btn-primary btn-lg">
                🤖 Bắt Đầu Tư Vấn Miễn Phí →
              </Link>
            </div>
            {/* Right */}
            <div>
              <ChatDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">💬 Đánh Giá</span>
            <h2 className="section-title">
              KHÁCH HÀNG{' '}
              <span className="gradient-text">NÓI GÌ VỀ CHÚNG TÔI</span>
            </h2>
            <p className="section-desc">Hơn 50.000 khách hàng tin tưởng — điểm đánh giá trung bình 4.9/5</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-card__stars">{'★'.repeat(t.stars)}</div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">{t.avatar}</div>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall stats */}
          <div style={{
            marginTop: '2.5rem',
            display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap',
            padding: '2rem',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-xl)', backdropFilter: 'blur(20px)',
          }}>
            {[
              { val: '4.9/5', label: 'Điểm tổng quát', icon: '⭐' },
              { val: '98%', label: 'Khách hài lòng', icon: '😊' },
              { val: '99%', label: 'Giao đúng hẹn', icon: '🚚' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{s.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 900,
                  fontSize: '1.8rem', color: 'var(--cyan)',
                }}>{s.val}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-inner">
            <div className="newsletter-text">
              <h2 className="newsletter-title">
                📧 Nhận Ưu Đãi{' '}
                <span className="gradient-text">Mỗi Ngày</span>
              </h2>
              <p className="newsletter-sub">
                Đăng ký nhận thông báo deal hot, ra mắt sản phẩm mới và tips build PC từ chuyên gia.
              </p>
            </div>
            <div>
              {newsletterDone ? (
                <div style={{
                  padding: '1.25rem 2rem',
                  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 'var(--r-xl)', color: 'var(--green)', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  ✅ Đăng ký thành công! Cảm ơn bạn.
                </div>
              ) : (
                <div>
                  <div className="newsletter-form">
                    <input
                      type="email"
                      placeholder="Nhập email của bạn..."
                      value={newsletterEmail}
                      onChange={e => setNewsletterEmail(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => { if (newsletterEmail) setNewsletterDone(true); }}
                    >
                      Đăng Ký
                    </button>
                  </div>
                  <p className="newsletter-note">
                    🔒 Không spam · Hủy bất cứ lúc nào · Dữ liệu được bảo mật
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <div style={{ marginBottom: '1rem' }}>
              <span className="section-label">✨ Bắt Đầu Ngay</span>
            </div>
            <h2 className="cta-title">
              Sẵn Sàng Xây Dựng{' '}
              <span className="gradient-text">PC Mơ Ước?</span>
            </h2>
            <p className="cta-desc">
              Hàng chục nghìn khách hàng đã tin tưởng PC Builder Shop.
              Tư vấn miễn phí — Giao nhanh — Bảo hành chính hãng.
            </p>
            <div className="cta-buttons">
              <Link href="/products" className="cta-btn cta-btn--primary">
                🛒 Khám Phá Sản Phẩm
              </Link>
              <Link href="/chat" className="cta-btn cta-btn--secondary">
                🤖 Tư Vấn AI Miễn Phí
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;