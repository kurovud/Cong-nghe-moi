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

  return (
    <div className="chat-widget">
      {/* Header */}
      <div className="chat-widget__header">
        <div className="chat-widget__header-info">
          <div className="chat-widget__avatar">AI</div>
          <div>
            <h3 className="chat-widget__title">PC Builder AI</h3>
            <span className="chat-widget__status">
              <span className="chat-widget__status-dot" />
              Đang hoạt động
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-widget__messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onFeedback={handleFeedback} />
        ))}

        {loading && (
          <div className="chat-message chat-message--assistant">
            <div className="chat-message__avatar">🤖</div>
            <div className="chat-message__content">
              <div className="chat-message__bubble">
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
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
        >
          {loading ? "..." : "Gửi"}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
