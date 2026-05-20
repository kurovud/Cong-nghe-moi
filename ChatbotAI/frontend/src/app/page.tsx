'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { cartApi } from '@/services/conference.api';
import ChatDemo from '@/components/home/ChatDemo';

const featuredDeals = [
  {
    name: 'PC Gaming i5 12400F - RTX 5060',
    price: '23.480.000',
    original: '24.990.000',
    discount: '-6%',
    status: 'Còn hàng',
  },
  {
    name: 'PC AMD Ryzen 7 5700X - RTX 3050',
    price: '16.280.000',
    original: '17.990.000',
    discount: '-10%',
    status: 'Còn hàng',
  },
  {
    name: 'PC Gaming i5 12400F - RTX 3050',
    price: '16.980.000',
    original: '18.990.000',
    discount: '-11%',
    status: 'Còn hàng',
  },
  {
    name: 'PC Gaming i5 14400F - RTX 5060 Ti',
    price: '29.480.000',
    original: '30.990.000',
    discount: '-5%',
    status: 'Còn hàng',
  },
];

const HomePage = () => {
  const router = useRouter();
  const { user, cart, refreshCart } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [addMessage, setAddMessage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      router.push('/products');
      return;
    }
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

      if (existing) {
        existing.quantity = existing.quantity + 1;
      } else {
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
    } catch (error) {
      setAddMessage('Lỗi khi thêm vào giỏ hàng. Vui lòng thử lại.');
    }
  };

  return (
    <div>
      {/* ===== TOP INFO BAR (TTG SHOP STYLE) ===== */}
      <div className="top-info-bar">
        <div className="container">
          <div className="top-info-links">
            <a href="#" className="top-info-link">Hệ thống showroom</a>
            <a href="#" className="top-info-link">Bán hàng trực tuyến</a>
            <a href="#" className="top-info-link">Trung tâm công nghệ</a>
            <a href="#" className="top-info-link">Tư vấn build PC</a>
            <a href="#" className="top-info-link">Tin tức và Blog</a>
          </div>
        </div>
      </div>

      {/* ===== HERO BANNER WITH SEARCH ===== */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient-1"></div>
          <div className="hero-gradient-2"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            {/* Logo & Branding */}
            <div className="hero-branding">
              <h1 className="hero-title">
                <span className="title-icon">PB</span>
                PC Builder Shop
              </h1>
              <p className="hero-tagline">Không gian linh kiện cao cấp cho gaming và sáng tạo</p>
            </div>

            {/* Search Bar */}
            <div className="search-box-container">
              <form className="search-box" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Tìm CPU, GPU, RAM, Mainboard..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button className="search-btn" type="submit" aria-label="Tìm kiếm sản phẩm">
                  <span>🔍</span>
                </button>
              </form>
              <div className="search-hotline">
                <div className="hotline-label">Hotline</div>
                <div className="hotline-number">1900-XXXX</div>
              </div>
            </div>

            {/* Category Navigation */}
            <div className="category-quick-nav">
              <a href="/products?category=cpu" className="nav-category">
                <span className="category-icon">🖥️</span>
                <span>CPU</span>
              </a>
              <a href="/products?category=gpu" className="nav-category">
                <span className="category-icon">🎮</span>
                <span>GPU</span>
              </a>
              <a href="/products?category=mainboard" className="nav-category">
                <span className="category-icon">⚡</span>
                <span>Mainboard</span>
              </a>
              <a href="/products?category=ram" className="nav-category">
                <span className="category-icon">🧠</span>
                <span>RAM</span>
              </a>
              <a href="/products?category=ssd" className="nav-category">
                <span className="category-icon">💾</span>
                <span>SSD</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROMOTIONAL BANNER SECTION ===== */}
      <section className="promo-section">
        <div className="container">
          <div className="promo-grid">
            {/* Promotional Card 1 */}
            <div className="promo-card promo-card--large">
              <div className="promo-card-content">
                <h3 className="promo-title">🖥️ PC GIÁ TỐT - LẮP SẴN</h3>
                <p className="promo-desc">Cấu hình mạnh - Giá hợp lý</p>
                <a href="/products" className="promo-link">Xem ngay →</a>
              </div>
              <div className="promo-card-icon">🎯</div>
            </div>

            {/* Promotional Card 2 */}
            <div className="promo-card promo-card--medium">
              <div className="promo-card-content">
                <h3 className="promo-title">🎁 GIỚI THIỆU BẠN MỚI</h3>
                <p className="promo-desc">Nhận quà tặng lên đến 2 triệu</p>
                <a href="/products" className="promo-link">Chi tiết →</a>
              </div>
            </div>

            {/* Promotional Card 3 */}
            <div className="promo-card promo-card--medium">
              <div className="promo-card-content">
                <h3 className="promo-title">🚀 KHUYẾN MÃI LIÊN TỤC</h3>
                <p className="promo-desc">Mỗi ngày có deal hot mới</p>
                <a href="/products" className="promo-link">Xem deal →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DEAL HOT SECTION ===== */}
      <section className="deal-hot-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title deal-hot-title">
              ⚡ DEAL HOT MỖI NGÀY - KHUYẾN MÃI LIÊN TỤC ⚡
            </h2>
            <p className="section-desc">Khung sản phẩm chạy liên tục để người dùng thấy ưu đãi mới rõ hơn và không bị đứt mạch.</p>
          </div>

          {addMessage && (
            <div style={{
              padding: '0.8rem 1rem',
              background: 'rgba(255,179,193,0.2)',
              border: '1px solid rgba(255,179,193,0.4)',
              borderRadius: '8px',
              color: '#162033',
              marginBottom: '1rem',
              fontWeight: 600,
            }}>
              ✓ {addMessage}
            </div>
          )}

          <div className="products-carousel-frame">
            <div className="products-carousel" aria-label="Deal hot sản phẩm chạy liên tục">
              {[...featuredDeals, ...featuredDeals].map((product, idx) => (
                <div key={`${product.name}-${idx}`} className="ttg-product-card" aria-hidden={idx >= featuredDeals.length ? 'true' : undefined}>
                  <div className="ttg-product-image">
                    <div className="ttg-image-placeholder">💻</div>
                    <div className="ttg-discount-badge">{product.discount}</div>
                  </div>
                  <div className="ttg-product-info">
                    <h3 className="ttg-product-name">{product.name}</h3>
                    <p className="ttg-product-original">
                      <span className="original-price">{product.original}₫</span>
                    </p>
                    <p className="ttg-product-price">{product.price}₫</p>
                    <p className="ttg-product-status">✓ {product.status}</p>
                    <button 
                      type="button"
                      className="ttg-add-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      Thêm Vào Giỏ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== BUILD BUNDLES SECTION ===== */}
      <section className="builds-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🎮 PC BUILD SẴN</h2>
            <p className="section-desc">Các cấu hình được chọn lọc từ chuyên gia</p>
          </div>

          <div className="builds-grid">
            {[
              {
                name: "Gaming Cơ Bản",
                specs: "i3 / GTX 1650 / 8GB RAM",
                price: "12.000.000",
                badge: "Phổ Biến",
              },
              {
                name: "Gaming Pro",
                specs: "i5 / RTX 3060 / 16GB RAM",
                price: "18.500.000",
                badge: "Bán Chạy",
              },
              {
                name: "Gaming Siêu Cấp",
                specs: "i7 / RTX 4070 / 32GB RAM",
                price: "35.000.000",
                badge: "Cao Cấp",
              },
              {
                name: "PC Văn Phòng",
                specs: "Ryzen 5 / 16GB RAM / SSD 512GB",
                price: "9.500.000",
                badge: "Tiết Kiệm",
              },
            ].map((build, idx) => (
              <div key={idx} className="build-card">
                <div className="build-badge">{build.badge}</div>
                <div className="build-icon">🖥️</div>
                <h3 className="build-name">{build.name}</h3>
                <p className="build-specs">{build.specs}</p>
                <p className="build-price">{build.price} VNĐ</p>
                <Link href="/builds" className="build-btn">Chi Tiết</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🛠️ DỊCH VỤ HỖ TRỢ</h2>
            <p className="section-desc">Dịch vụ vận hành chuyên nghiệp cho toàn bộ vòng đời sản phẩm</p>
          </div>

          <div className="services-grid">
            {[
              { icon: "🔧", title: "Lắp Ráp PC", desc: "Lắp ráp chuyên nghiệp tại nhà miễn phí" },
              { icon: "🏠", title: "Lắp Đặt Tại Nhà", desc: "Hỗ trợ lắp đặt và kiểm tra tại nơi ở" },
              { icon: "💳", title: "Thanh Toán Linh Hoạt", desc: "Nhiều hình thức thanh toán tiện lợi" },
              { icon: "🔄", title: "Thu Cũ Đổi Mới", desc: "Thu mua linh kiện cũ giá tốt" },
              { icon: "📖", title: "Hướng Dẫn Chi Tiết", desc: "Tư vấn & hướng dẫn lắp ráp 24/7" },
              { icon: "🚚", title: "Vận Chuyển Nhanh", desc: "Giao hàng toàn quốc chất lượng cao" },
            ].map((service, idx) => (
              <div key={idx} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/services" className="button" style={{ display: 'inline-block', padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none' }}>
              Xem Tất Cả Dịch Vụ →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CHAT DEMO SECTION ===== */}
      <section className="chat-demo-section">
        <div className="container">
          <ChatDemo />
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Sẵn Sàng Xây Dựng PC Mơ Ước?</h2>
            <p className="cta-desc">Liên hệ ngay để nhận tư vấn cấu hình tối ưu theo nhu cầu thực tế</p>
            <div className="cta-buttons">
              <Link href="/products" className="cta-btn cta-btn--primary">
                Khám Phá Sản Phẩm
              </Link>
              <Link href="/chat" className="cta-btn cta-btn--secondary">
                Tư Vấn AI Ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;