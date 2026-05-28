"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatResponse } from "@/types/chat.type";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const suggestedQuestions = [
  "Tư vấn cấu hình PC gaming 15 triệu",
  "So sánh RTX 4060 Ti và RX 7600",
  "Hướng dẫn lắp ráp PC",
  "Laptop gaming nào tốt dưới 25 triệu?",
  "Chính sách bảo hành?"
];

const ChatDemo = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Xin chào! 👋 Tôi là trợ lý AI của PC Builder Shop. Hỏi tôi về linh kiện PC, cấu hình build, laptop hoặc hướng dẫn lắp ráp nhé!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text })
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer ?? data.reply ?? 'Xin lỗi, tôi không có câu trả lời.' , sources: data.matches?.map((m: any) => m.name) }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Hệ thống đang bận. Vui lòng thử lại sau."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="card">
      <div className="chat-window" ref={chatWindowRef} aria-live="polite">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`chat-bubble ${message.role === "user" ? "user" : ""}`}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
              <span>{message.role === "user" ? "👤" : "🤖"}</span>
              <strong style={{ fontSize: "0.8rem" }}>
                {message.role === "user" ? "Bạn" : "PC Builder AI"}
              </strong>
            </div>
            <div
              style={{ fontSize: "0.9rem", lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: simpleMarkdown(message.content) }}
            />
            {message.sources && message.sources.length > 0 && (
              <div className="tag-list" style={{ marginTop: "0.5rem" }}>
                {message.sources.map((source) => (
                  <span key={source} className="tag">
                    {source}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble">
            <div className="typing-indicator">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>
      <div style={{ display: "grid", gap: "0.75rem", marginTop: "1.5rem" }}>
        <div className="tag-list" style={{ flexWrap: "wrap" }}>
          {suggestedQuestions.map((question) => (
            <button
              key={question}
              className="button secondary"
              style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem" }}
              onClick={() => sendMessage(question)}
              type="button"
              disabled={loading}
            >
              {question}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <input
            className="input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi về linh kiện, cấu hình PC..."
            disabled={loading}
          />
          <button
            className="button"
            onClick={() => sendMessage(input)}
            type="button"
            disabled={loading || !input.trim()}
          >
            {loading ? "⏳" : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  );
};

function simpleMarkdown(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h4 style='margin:0.5rem 0 0.25rem;font-size:0.95rem'>$1</h4>")
    .replace(/^## (.+)$/gm, "<h3 style='margin:0.75rem 0 0.35rem;font-size:1rem'>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/`(.+?)`/g, "<code style='background:rgba(29,78,216,0.08);padding:0.1rem 0.3rem;border-radius:4px;font-size:0.82rem'>$1</code>")
    .replace(/^[•\-] (.+)$/gm, "<div style='padding-left:0.5rem'>• $1</div>")
    .replace(/^\d+\. (.+)$/gm, "<div style='padding-left:0.5rem'>$&</div>")
    .replace(/^---$/gm, "<hr style='border:none;border-top:1px solid #e2e8f0;margin:0.5rem 0'/>")
    .replace(/\n/g, "<br/>");
}

export default ChatDemo;
