import ChatWindow from "@/components/chat/ChatWindow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Tư Vấn AI - PC Builder Shop",
  description: "Chat với AI để được tư vấn linh kiện, cấu hình PC, hướng dẫn lắp ráp.",
};

type ChatPageProps = {
  searchParams?: {
    product?: string;
    name?: string;
    category?: string;
  };
};

const ChatPage = ({ searchParams }: ChatPageProps) => {
  const productName = searchParams?.name ? decodeURIComponent(searchParams.name) : "";
  const productId = searchParams?.product ? decodeURIComponent(searchParams.product) : "";
  const category = searchParams?.category ? decodeURIComponent(searchParams.category) : "";

  const initialPrompt = productId
    ? `Tư vấn chi tiết giúp mình sản phẩm ${productName || productId}. Cho mình ưu/nhược điểm, đối tượng phù hợp, hiệu năng thực tế, khả năng tương thích và gợi ý lựa chọn thay thế tốt hơn nếu có.`
    : undefined;

  const quickTopics = [
    { icon: "🖥️", label: "Tư vấn cấu hình PC", prompt: "Tư vấn cấu hình PC gaming phù hợp với ngân sách" },
    { icon: "💰", label: "Kiểm tra giá sản phẩm", prompt: "Kiểm tra giá và tình trạng các sản phẩm hiện tại" },
    { icon: "⚖️", label: "So sánh linh kiện", prompt: "So sánh hai linh kiện cụ thể cho tôi" },
    { icon: "🔧", label: "Hướng dẫn lắp ráp", prompt: "Hướng dẫn lắp ráp PC từng bước chi tiết" },
    { icon: "🔄", label: "Kiểm tra tương thích", prompt: "Kiểm tra tính tương thích giữa các linh kiện" },
    { icon: "📦", label: "Đặt hàng & giao hàng", prompt: "Thông tin về đặt hàng và chính sách giao hàng" },
    { icon: "🛡️", label: "Bảo hành & đổi trả", prompt: "Chính sách bảo hành và đổi trả sản phẩm" },
    { icon: "💻", label: "Tư vấn laptop", prompt: "Tư vấn chọn laptop phù hợp nhu cầu của tôi" },
  ];

  return (
    <div className="chat-page">
      <style>{`
        @keyframes heroGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .chat-page {
          min-height: 100vh;
          background: var(--bg);
          padding: 0;
        }
        .chat-page__hero {
          text-align: center;
          padding: 2rem 1rem 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .chat-page__hero::before {
          content: '';
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          height: 200px;
          background: radial-gradient(ellipse, rgba(0,212,255,0.12) 0%, transparent 70%);
          animation: heroGlow 3s ease-in-out infinite;
          pointer-events: none;
        }
        .chat-page__hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(0,212,255,0.1);
          border: 1px solid rgba(0,212,255,0.25);
          border-radius: 20px;
          padding: 0.3rem 0.85rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--cyan);
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }
        .chat-page__hero h1 {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 900;
          background: var(--grad-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 0.4rem;
          letter-spacing: -0.02em;
        }
        .chat-page__hero-sub {
          font-size: 0.85rem;
          color: var(--text-2);
          max-width: 500px;
          margin: 0 auto;
        }
        .chat-page__layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1.25rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.25rem 1.5rem;
          height: calc(100vh - 160px);
          min-height: 500px;
        }
        @media (max-width: 900px) {
          .chat-page__layout {
            grid-template-columns: 1fr;
            height: auto;
          }
          .chat-page__sidebar { display: none; }
        }
        .chat-page__sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
          animation: fadeInLeft 0.4s ease both;
        }
        .chat-page__sidebar::-webkit-scrollbar { width: 4px; }
        .chat-page__sidebar::-webkit-scrollbar-track { background: transparent; }
        .chat-page__sidebar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        .sidebar-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.1rem;
          flex-shrink: 0;
        }
        .sidebar-card__title {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-2);
          margin: 0 0 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .sidebar-card__title::before {
          content: '';
          display: inline-block;
          width: 12px;
          height: 2px;
          background: var(--grad-brand);
          border-radius: 2px;
        }
        .quick-topic-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0.65rem;
          border-radius: 10px;
          cursor: pointer;
          color: var(--text-2);
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.18s ease;
          border: 1px solid transparent;
          margin-bottom: 3px;
        }
        .quick-topic-item:hover {
          background: rgba(0,212,255,0.08);
          border-color: rgba(0,212,255,0.2);
          color: var(--text);
          transform: translateX(3px);
        }
        .quick-topic-item__icon {
          font-size: 0.95rem;
          flex-shrink: 0;
        }
        .product-context-card {
          background: linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(168,85,247,0.06) 100%);
          border: 1px solid rgba(0,212,255,0.25);
          border-radius: 14px;
          padding: 1rem;
        }
        .product-context-card__tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(0,212,255,0.15);
          border-radius: 6px;
          padding: 0.2rem 0.6rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--cyan);
          letter-spacing: 0.05em;
          margin-bottom: 0.6rem;
        }
        .product-context-card__name {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text);
          margin-bottom: 0.3rem;
        }
        .product-context-card__cat {
          font-size: 0.75rem;
          color: var(--text-2);
        }
        .tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 0.4rem;
        }
        .tips-list li {
          font-size: 0.78rem;
          color: var(--text-2);
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          line-height: 1.4;
        }
        .tips-list li::before {
          content: '✦';
          color: var(--cyan);
          font-size: 0.6rem;
          margin-top: 3px;
          flex-shrink: 0;
        }
        .chat-page__main {
          animation: fadeInRight 0.4s ease both;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }
      `}</style>

      {/* Hero */}
      <div className="chat-page__hero">
        <div className="chat-page__hero-badge">
          <span>⚡</span> AI Powered by PC Builder Shop
        </div>
        <h1>Trung tâm tư vấn AI</h1>
        <p className="chat-page__hero-sub">
          Hỏi bất kỳ điều gì về linh kiện PC, laptop, cấu hình build và hướng dẫn lắp ráp.
        </p>
      </div>

      <div className="chat-page__layout">
        {/* Sidebar */}
        <aside className="chat-page__sidebar">
          {/* Product context */}
          {productId && (
            <div className="product-context-card">
              <div className="product-context-card__tag">🎯 Đang tư vấn theo sản phẩm</div>
              <div className="product-context-card__name">{productName || productId}</div>
              {category && <div className="product-context-card__cat">Danh mục: {category}</div>}
            </div>
          )}

          {/* Quick topics */}
          <div className="sidebar-card">
            <p className="sidebar-card__title">Chủ đề phổ biến</p>
            {quickTopics.map((topic) => (
              <div key={topic.label} className="quick-topic-item">
                <span className="quick-topic-item__icon">{topic.icon}</span>
                <span>{topic.label}</span>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="sidebar-card">
            <p className="sidebar-card__title">Mẹo sử dụng</p>
            <ul className="tips-list">
              <li>Nêu rõ ngân sách để nhận gợi ý chính xác nhất</li>
              <li>Hỏi &quot;so sánh A và B&quot; để xem bảng so sánh chi tiết</li>
              <li>Hỏi &quot;hướng dẫn lắp ráp&quot; để xem từng bước cụ thể</li>
            </ul>
          </div>
        </aside>

        {/* Main chat area */}
        <main className="chat-page__main">
          <ChatWindow initialPrompt={initialPrompt} />
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
