"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import type { ChatMessage as ChatMessageType, ChatResponse } from "@/types/chat.type";
import { sendChatFeedback, sendChatMessage } from "@/services/chatbot.api";

const defaultSuggestions = [
  "Tư vấn cấu hình PC gaming 15 triệu",
  "So sánh RTX 4060 Ti và RX 7600",
  "Hướng dẫn lắp ráp PC từ A-Z",
  "Laptop gaming tốt nhất dưới 25 triệu?"
];

type ChatWindowProps = {
  initialPrompt?: string;
};

const ChatWindow = ({ initialPrompt }: ChatWindowProps) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Xin chào, tôi là trợ lý AI của **PC Builder Shop**.\n\nTôi có thể hỗ trợ:\n• Tư vấn cấu hình theo ngân sách\n• Gợi ý linh kiện phù hợp\n• Hướng dẫn lắp ráp chi tiết\n• So sánh sản phẩm\n\nBạn muốn bắt đầu từ nhu cầu nào?",
      contentType: "text",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(defaultSuggestions);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedWithPromptRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      contentType: "text",
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSuggestions([]);
    setLoading(true);

    try {
      const data: ChatResponse = await sendChatMessage({
        message: text,
        conversationId,
      });

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const assistantMsg: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        responseId: data.responseId,
        agent: data.agent,
        contentType: data.contentType,
        products: data.products,
        assemblySteps: data.assemblySteps,
        comparison: data.comparison,
        sources: data.sources,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (data.suggestedQuestions) {
        setSuggestions(data.suggestedQuestions);
      }
    } catch (error: any) {
      const raw = String(error?.message || "").toLowerCase();
      const isQuotaIssue = raw.includes("quota") || raw.includes("429") || raw.includes("resource_exhausted");
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: isQuotaIssue
            ? "Xin lỗi, dịch vụ AI đang tạm hết quota. Vui lòng thử lại sau ít phút."
            : "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.",
          contentType: "text",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!initialPrompt || initializedWithPromptRef.current) return;
    initializedWithPromptRef.current = true;
    setTimeout(() => {
      sendMessage(initialPrompt);
    }, 0);
  }, [initialPrompt]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleFeedback = async (messageId: string, rating: "like" | "dislike") => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg?.responseId) return;

    try {
      await sendChatFeedback({ responseId: msg.responseId, rating });
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, feedback: rating } : m))
      );
    } catch {
      // Do not block chat UX on feedback errors.
    }
  };

  const isEmpty = messages.length === 1 && messages[0].id === "welcome";

  return (
    <div className="chat-widget">
      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes statusPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.6); }
          50% { box-shadow: 0 0 0 5px rgba(52, 211, 153, 0); }
        }
        @keyframes messageIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes avatarGlow {
          0%, 100% { box-shadow: 0 0 12px rgba(0,212,255,0.4); }
          50% { box-shadow: 0 0 24px rgba(0,212,255,0.7), 0 0 40px rgba(168,85,247,0.3); }
        }
        .chat-widget {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: linear-gradient(180deg, rgba(0,10,30,0.6) 0%, rgba(5,13,26,0.8) 100%);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(8px);
            box-shadow: 0 0 28px rgba(0,212,255,0.04), 0 12px 30px rgba(0,0,0,0.35);
        }
        .chat-widget__header {
          padding: 1rem 1.25rem;
          background: linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(168,85,247,0.04) 100%);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .chat-widget__header-info {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .chat-widget__avatar {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: var(--grad-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: 800;
          color: #050d1a;
          animation: avatarGlow 3s ease-in-out infinite;
          flex-shrink: 0;
        }
        .chat-widget__title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text);
          margin: 0 0 0.15rem;
          letter-spacing: 0.01em;
        }
        .chat-widget__status {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          color: #34d399;
          font-weight: 600;
        }
        .chat-widget__status-dot {
          width: 7px;
          height: 7px;
          background: #34d399;
          border-radius: 50%;
          animation: statusPulse 2s ease-in-out infinite;
        }
        .chat-widget__header-badges {
          display: flex;
          gap: 0.5rem;
        }
        .chat-widget__badge {
          background: rgba(0,212,255,0.1);
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: 6px;
          padding: 0.2rem 0.55rem;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--cyan);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .chat-widget__messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
        .chat-widget__messages::-webkit-scrollbar { width: 5px; }
        .chat-widget__messages::-webkit-scrollbar-track { background: transparent; }
        .chat-widget__messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        .chat-message--user .chat-message__bubble,
        .chat-message--assistant .chat-message__bubble {
          animation: messageIn 0.25s ease both;
        }
        .chat-widget__empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          gap: 1.5rem;
          flex: 1;
        }
        .chat-widget__empty-icon {
          width: 64px;
          height: 64px;
          background: var(--grad-brand);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          box-shadow: 0 0 30px rgba(0,212,255,0.3);
        }
        .chat-widget__empty-title {
          font-size: 1.1rem;
          font-weight: 800;
          background: var(--grad-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          margin: 0;
        }
        .chat-widget__empty-sub {
          font-size: 0.82rem;
          color: var(--text-2);
          text-align: center;
          margin: -1rem 0 0;
          max-width: 280px;
        }
        .chat-widget__empty-suggestions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
          max-width: 380px;
        }
        .chat-widget__empty-suggestion {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.7rem 1rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          color: var(--text-2);
          font-size: 0.82rem;
          font-weight: 500;
          transition: all 0.18s ease;
          text-align: left;
        }
        .chat-widget__empty-suggestion:hover {
          border-color: rgba(0,212,255,0.35);
          background: rgba(0,212,255,0.07);
          color: var(--text);
          transform: translateX(4px);
        }
        .chat-widget__empty-suggestion-icon {
          font-size: 1rem;
          flex-shrink: 0;
        }
        .typing-bubble {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.6rem 0;
          animation: messageIn 0.25s ease both;
        }
        .typing-avatar {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2));
          border: 1px solid rgba(0,212,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0.65rem 1rem;
          background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(168,85,247,0.06));
          border: 1px solid rgba(0,212,255,0.15);
          border-radius: 0 14px 14px 14px;
        }
        .typing-indicator span {
          width: 6px;
          height: 6px;
          background: var(--cyan);
          border-radius: 50%;
          animation: dotPulse 1.2s ease-in-out infinite;
        }
        .typing-indicator span:nth-child(2) { animation-delay: 0.15s; background: linear-gradient(135deg, #00d4ff, #a855f7); }
        .typing-indicator span:nth-child(3) { animation-delay: 0.3s; background: var(--purple); }
        .chat-widget__suggestions {
          padding: 0.5rem 1rem 0.25rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          flex-shrink: 0;
        }
        .chat-widget__suggestion-btn {
          padding: 0.35rem 0.85rem;
          background: rgba(0,212,255,0.07);
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: 20px;
          color: var(--cyan);
          font-size: 0.76rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
        .chat-widget__suggestion-btn:hover {
          background: rgba(0,212,255,0.15);
          border-color: var(--cyan);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,212,255,0.2);
        }
        .chat-widget__input-area {
          padding: 0.85rem 1rem;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 0.6rem;
          align-items: center;
          background: rgba(0,0,0,0.2);
          flex-shrink: 0;
        }
        .chat-widget__input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 0.65rem 1rem;
          color: var(--text);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          min-width: 0;
        }
        .chat-widget__input::placeholder { color: var(--text-2); opacity: 0.6; }
        .chat-widget__input:focus {
          border-color: rgba(0,212,255,0.4);
          box-shadow: 0 0 0 3px rgba(0,212,255,0.08);
        }
        .chat-widget__input:disabled { opacity: 0.5; cursor: not-allowed; }
        .chat-widget__send-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: var(--grad-brand);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          transition: all 0.2s ease;
          flex-shrink: 0;
          color: #050d1a;
          font-weight: 700;
        }
        .chat-widget__send-btn:hover:not(:disabled) {
          transform: scale(1.08);
          box-shadow: 0 4px 16px rgba(0,212,255,0.4);
        }
        .chat-widget__send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }
        .chat-widget__input-hint {
          font-size: 0.65rem;
          color: var(--text-2);
          opacity: 0.5;
          text-align: right;
          padding: 0 1rem 0.5rem;
          flex-shrink: 0;
        }
      `}</style>

      {/* Header */}
      <div className="chat-widget__header">
        <div className="chat-widget__header-info">
          <div className="chat-widget__avatar">⚡</div>
          <div>
            <h3 className="chat-widget__title">PC Builder AI</h3>
            <span className="chat-widget__status">
              <span className="chat-widget__status-dot" />
              Đang hoạt động
            </span>
          </div>
        </div>
        <div className="chat-widget__header-badges">
          <span className="chat-widget__badge">RAG</span>
          <span className="chat-widget__badge">GPT-4o</span>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-widget__messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onFeedback={handleFeedback} />
        ))}

        {loading && (
          <div className="typing-bubble">
            <div className="typing-avatar">🤖</div>
            <div className="typing-indicator">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && !loading && (
        <div className="chat-widget__suggestions">
          {suggestions.map((q) => (
            <button
              key={q}
              className="chat-widget__suggestion-btn"
              onClick={() => sendMessage(q)}
              type="button"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="chat-widget__input-area">
        <input
          ref={inputRef}
          className="chat-widget__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập câu hỏi về linh kiện, cấu hình PC..."
          disabled={loading}
        />
        <button
          className="chat-widget__send-btn"
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          type="button"
          title="Gửi (Enter)"
        >
          {loading ? "⏳" : "➤"}
        </button>
      </div>
      <div className="chat-widget__input-hint">Enter để gửi • Shift+Enter xuống dòng</div>
    </div>
  );
};

export default ChatWindow;
