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

  return (
    <div className="builds-storefront">
      {/* ===== BUILDS HERO ===== */}
      <section className="products-hero" style={{ background: 'linear-gradient(135deg, #f2d5e0 0%, #dfe8f8 100%)' }}>
        <div className="container">
          <h1 style={{ color: '#162033', marginBottom: '1rem' }}>🎮 PC BUILD SẴN</h1>
          <p style={{ color: '#4a5568', fontSize: '1.1rem' }}>
            Chọn cấu hình hoàn chỉnh theo nhu cầu của bạn
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(255,143,31,0.12)', borderRadius: '999px', padding: '0.45rem 0.9rem', color: '#162033', fontWeight: 700 }}>
              {cart.totalItems} sản phẩm trong giỏ
            </div>
            <button type="button"
              onClick={() => router.push('/cart')}
              style={{
                padding: '0.6rem 1rem',
                background: 'linear-gradient(135deg, #ffb3c1, #ff9f7a)',
                color: '#162033',
                border: 'none',
                borderRadius: '999px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Xem Giỏ Hàng
            </button>
          </div>
          {actionMessage && (
            <p style={{ marginTop: '1rem', color: '#162033', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,143,31,0.12)', display: 'inline-block', padding: '0.65rem 0.9rem', borderRadius: '12px' }}>
              {actionMessage}
            </p>
          )}
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div className="products-layout">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            {/* Filter & Actions */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  {categories.map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        padding: '0.5rem 1.2rem',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: selectedCategory === cat.id ? '#ffb3c1' : 'rgba(255, 250, 252, 0.9)',
                        color: selectedCategory === cat.id ? '#fff' : '#162033',
                        fontWeight: selectedCategory === cat.id ? 700 : 500,
                        transition: 'all 0.3s',
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                <div style={{ padding: '0.7rem 1rem', background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(255,143,31,0.12)', borderRadius: '999px', color: '#162033', fontWeight: 700 }}>
                  Chọn build phù hợp và thêm ngay vào giỏ hàng
                </div>
              </div>

              {showForm && (
                <div style={{ marginBottom: '1rem', padding: '1rem 1.1rem', borderRadius: '14px', border: '1px solid rgba(255, 143, 31, 0.12)', background: 'rgba(255,255,255,0.7)', color: '#162033', fontWeight: 600 }}>
                  Chế độ quản trị đã được chuyển sang khu vực admin.
                </div>
              )}

              {/* Builds Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.8rem' }}>
                {filteredBuilds.map(build => (
                  <div
                    key={build.id}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 250, 252, 0.96), rgba(247, 251, 255, 0.97))',
                      border: '1px solid rgba(255, 143, 31, 0.12)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(255, 179, 193, 0.15)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.8rem' }}>
                      <div>
                        {build.badge && (
                          <span style={{
                            display: 'inline-block',
                            background: 'linear-gradient(90deg, #ff9f7a, #ffb3c1)',
                            color: '#162033',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            marginBottom: '0.5rem',
                          }}>
                            {build.badge}
                          </span>
                        )}
                        <h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.08rem)', color: '#162033', margin: 0, marginBottom: '0.25rem' }}>
                          {build.name}
                        </h3>
                        <p style={{ margin: 0, color: '#7c8fa6', fontSize: '0.82rem' }}>Còn {build.stock} bộ sẵn sàng giao</p>
                      </div>
                    </div>

                    <p style={{ color: '#4a5568', fontSize: '0.95rem', margin: 0 }}>
                      {build.description}
                    </p>

                    <div style={{ background: 'rgba(255, 179, 193, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                      <p style={{ color: '#162033', fontSize: '0.9rem', margin: 0, marginBottom: '0.5rem', fontWeight: 600 }}>
                        📋 Cấu hình:
                      </p>
                      <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.85rem', color: '#4a5568' }}>
                        <li>CPU: {build.specs.cpu}</li>
                        <li>GPU: {build.specs.gpu}</li>
                        <li>RAM: {build.specs.ram}</li>
                        <li>Storage: {build.specs.storage}</li>
                        <li>PSU: {build.specs.psu}</li>
                      </ul>
                    </div>

                    <p style={{ color: '#7c8fa6', fontSize: '0.9rem', margin: 0 }}>
                      ⚡ {build.performance}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{
                        background: 'linear-gradient(90deg, #ff6b9d, #ff9f7a)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                        fontWeight: 700,
                        margin: 0,
                      }}>
                        {(build.price / 1000000).toFixed(1)}M VNĐ
                      </p>
                      <button type="button"
                        onClick={() => handleAddToCart(build)}
                        style={{
                          padding: '0.6rem 1.2rem',
                          background: 'linear-gradient(135deg, #ffb3c1, #ff9f7a)',
                          color: '#162033',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        🛒 Giỏ Hàng
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255, 250, 252, 0.96), rgba(247, 251, 255, 0.97))',
      border: '1px solid rgba(255, 143, 31, 0.12)',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem',
    }}>
      <h3 style={{ color: '#162033', marginTop: 0 }}>{build ? 'Chỉnh Sửa Build' : 'Thêm Build Mới'}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Tên build"
          value={formData.name}
          onChange={e => handleChange('name', e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 143, 31, 0.2)', fontSize: '0.95rem' }}
        />
        <select
          value={formData.category}
          onChange={e => handleChange('category', e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 143, 31, 0.2)', fontSize: '0.95rem' }}
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
          style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 143, 31, 0.2)', fontSize: '0.95rem' }}
        />
        <input
          type="number"
          min={0}
          placeholder="Tồn kho"
          value={formData.stock}
          onChange={e => handleChange('stock', Number(e.target.value))}
          style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 143, 31, 0.2)', fontSize: '0.95rem' }}
        />
        <input
          type="text"
          placeholder="Mô tả hiệu năng"
          value={formData.performance}
          onChange={e => handleChange('performance', e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 143, 31, 0.2)', fontSize: '0.95rem' }}
        />
        <textarea
          placeholder="Mô tả chi tiết"
          value={formData.description}
          onChange={e => handleChange('description', e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 143, 31, 0.2)', fontSize: '0.95rem', gridColumn: '1 / -1' }}
          rows={2}
        />
        <input
          type="text"
          placeholder="CPU"
          value={formData.specs.cpu}
          onChange={e => handleChange('specs.cpu', e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 143, 31, 0.2)', fontSize: '0.95rem' }}
        />
        <input
          type="text"
          placeholder="GPU"
          value={formData.specs.gpu}
          onChange={e => handleChange('specs.gpu', e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 143, 31, 0.2)', fontSize: '0.95rem' }}
        />
        <input
          type="text"
          placeholder="RAM"
          value={formData.specs.ram}
          onChange={e => handleChange('specs.ram', e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 143, 31, 0.2)', fontSize: '0.95rem' }}
        />
        <input
          type="text"
          placeholder="Storage"
          value={formData.specs.storage}
          onChange={e => handleChange('specs.storage', e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 143, 31, 0.2)', fontSize: '0.95rem' }}
        />
        <input
          type="text"
          placeholder="PSU"
          value={formData.specs.psu}
          onChange={e => handleChange('specs.psu', e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 143, 31, 0.2)', fontSize: '0.95rem' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="button"
          onClick={() => onSave(formData)}
          style={{
            padding: '0.8rem 1.5rem',
            background: 'linear-gradient(135deg, #ffb3c1, #ff9f7a)',
            color: '#162033',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Lưu Build
        </button>
        <button type="button"
          onClick={onCancel}
          style={{
            padding: '0.8rem 1.5rem',
            background: '#ddd',
            color: '#162033',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default BuildsPage;
