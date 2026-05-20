import ChatWindow from "@/components/chat/ChatWindow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Tư Vấn - PC Builder Shop",
  description: "Chat với AI để được tư vấn linh kiện, cấu hình PC, hướng dẫn lắp ráp."
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

  return (
    <div className="chat-page">
      <div className="container">
        <div className="chat-page__layout">
          {/* Sidebar */}
          <aside className="chat-page__sidebar">
            <h3>Trung tâm tư vấn AI</h3>
            <p className="muted">
              Hỏi bất kỳ điều gì về linh kiện PC, laptop, cấu hình build và hướng dẫn lắp ráp.
            </p>

            {productId && (
              <div className="chat-page__tips" style={{ marginTop: "1rem" }}>
                <h4>🎯 Đang tư vấn theo sản phẩm</h4>
                <ul>
                  <li>{productName || productId}</li>
                  <li>{category ? `Danh mục: ${category}` : ""}</li>
                </ul>
              </div>
            )}

            <div className="chat-page__quick-topics">
              <h4>Chủ đề phổ biến</h4>
              <ul>
                <li>🖥️ Tư vấn cấu hình PC</li>
                <li>💰 Kiểm tra giá sản phẩm</li>
                <li>⚖️ So sánh linh kiện</li>
                <li>🔧 Hướng dẫn lắp ráp</li>
                <li>🔄 Kiểm tra tương thích</li>
                <li>📦 Đặt hàng & giao hàng</li>
                <li>🛡️ Bảo hành & đổi trả</li>
                <li>💻 Tư vấn laptop</li>
              </ul>
            </div>

            <div className="chat-page__tips">
              <h4>Mẹo sử dụng</h4>
              <ul>
                <li>Nêu rõ ngân sách để nhận gợi ý chính xác</li>
                <li>Hỏi &quot;so sánh A và B&quot; để xem bảng so sánh</li>
                <li>Hỏi &quot;hướng dẫn lắp ráp&quot; để xem từng bước</li>
              </ul>
            </div>
          </aside>

          {/* Main chat area */}
          <main className="chat-page__main">
            <ChatWindow initialPrompt={initialPrompt} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
