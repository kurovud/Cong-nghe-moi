"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  createLiveChatSession,
  fetchLiveChatMessages,
  sendLiveChatMessage,
} from "@/services/live-chat.api";
import type { LiveChatMessage, LiveChatSessionSummary } from "@/types/live-chat.type";

const STORAGE_KEY = "pc-builder-live-chat-session";

const LiveSupportChat = () => {
  const { user } = useAuth();
  const [session, setSession] = useState<LiveChatSessionSummary | null>(null);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const hydrateSession = async (sessionId: string) => {
    const data = await fetchLiveChatMessages(sessionId, "customer");
    setSession(data.session);
    setMessages(data.messages);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, sessionId);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    let mounted = true;

    const restore = async () => {
      try {
        const storedSessionId = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
        if (storedSessionId) {
          await hydrateSession(storedSessionId);
          if (mounted) setBooting(false);
          return;
        }
      } catch {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }

      if (mounted) {
        setMessages([]);
        setBooting(false);
      }
    };

    void restore();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!session?.id) return;

    let cancelled = false;
    let delay = 3000;

    const poll = async () => {
      if (cancelled) return;
      try {
        const data = await fetchLiveChatMessages(session.id, "customer");
        setSession(data.session);
        setMessages(data.messages);
        // reset delay on success
        delay = 3000;
      } catch {
        // on failure, back off up to 15s
        delay = Math.min(15000, delay * 1.8);
      }
      if (cancelled) return;
      window.setTimeout(poll, delay + Math.round(Math.random() * 400));
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [session?.id]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || loading) return;

    setLoading(true);
    setInput("");

    try {
      if (!session?.id) {
        const created = await createLiveChatSession({
          userId: user?.id || "guest",
          userName: user?.name || "Khách hàng",
          userEmail: user?.email,
          subject: "Hỗ trợ trực tiếp",
          source: "floating-widget",
          initialMessage: content,
        });
        setSession(created.session);
        setMessages(created.messages);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, created.session.id);
        }
        return;
      }

      const result = await sendLiveChatMessage(session.id, {
        senderRole: "customer",
        senderName: user?.name || "Khách hàng",
        content,
      });
      setSession(result.session);
      setMessages(result.messages);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sessionId: session?.id || "pending",
          senderRole: "system",
          senderName: "Hệ thống",
          content: error?.message || "Không thể gửi tin nhắn lúc này.",
          timestamp: new Date().toISOString(),
          readByCustomer: true,
          readByAdmin: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = session
    ? session.status === "active"
      ? "Nhân viên đang hỗ trợ"
      : session.status === "closed"
        ? "Phiên đã kết thúc"
        : "Đang chờ nhân viên"
    : "Sẵn sàng hỗ trợ";

  return (
    <div className="live-chat-widget">
      <style>{`
        @keyframes pulseDot {
          0%, 100% { transform: scale(0.8); opacity: 0.45; }
          50% { transform: scale(1); opacity: 1; }
        }
        .live-chat-widget {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 520px;
          background: linear-gradient(180deg, rgba(5,13,26,0.94) 0%, rgba(9,18,34,0.98) 100%);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(8px);
          box-shadow: 0 24px 70px rgba(0,0,0,0.45);
        }
        .live-chat-widget__header {
          padding: 1rem 1.1rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(135deg, rgba(0,212,255,0.06), rgba(168,85,247,0.04));
        }
        .live-chat-widget__identity {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
        }
        .live-chat-widget__avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #00d4ff, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #050d1a;
          font-weight: 900;
          box-shadow: 0 0 24px rgba(0,212,255,0.25);
          flex-shrink: 0;
        }
        .live-chat-widget__title {
          margin: 0;
          color: var(--text);
          font-weight: 800;
          font-size: 0.95rem;
        }
        .live-chat-widget__subtitle {
          color: var(--text-3);
          font-size: 0.72rem;
          margin-top: 0.1rem;
        }
        .live-chat-widget__status {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.72rem;
          color: var(--green);
          font-weight: 700;
          padding: 0.35rem 0.7rem;
          border-radius: 999px;
          border: 1px solid rgba(16,185,129,0.25);
          background: rgba(16,185,129,0.08);
          white-space: nowrap;
        }
        .live-chat-widget__status-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: currentColor;
          animation: pulseDot 1.8s ease-in-out infinite;
        }
        .live-chat-widget__messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          scrollbar-width: thin;
        }
        .live-chat-widget__empty {
          display: grid;
          gap: 0.75rem;
          align-content: center;
          justify-items: start;
          min-height: 300px;
          color: var(--text-2);
          padding: 1rem 0.2rem;
        }
        .live-chat-widget__empty-card {
          width: 100%;
          padding: 1rem;
          border-radius: 16px;
          border: 1px dashed var(--border);
          background: rgba(255,255,255,0.02);
        }
        .live-chat-widget__bubble {
          max-width: 82%;
          padding: 0.85rem 0.95rem;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text);
        }
        .live-chat-widget__bubble--customer {
          margin-left: auto;
          background: linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.08));
          border-color: rgba(168,85,247,0.2);
        }
        .live-chat-widget__bubble--admin {
          background: linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.06));
          border-color: rgba(0,212,255,0.18);
        }
        .live-chat-widget__bubble--system {
          margin: 0 auto;
          max-width: 95%;
          background: rgba(255,255,255,0.04);
          color: var(--text-2);
        }
        .live-chat-widget__bubble-meta {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          font-size: 0.68rem;
          color: var(--text-3);
          margin-top: 0.45rem;
        }
        .live-chat-widget__composer {
          border-top: 1px solid var(--border);
          padding: 0.9rem;
          display: grid;
          gap: 0.75rem;
          background: rgba(255,255,255,0.02);
        }
        .live-chat-widget__input-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .live-chat-widget__input {
          flex: 1;
          min-height: 52px;
          max-height: 120px;
          padding: 0.9rem 1rem;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.03);
          color: var(--text);
          resize: vertical;
          outline: none;
          font: inherit;
        }
        .live-chat-widget__input::placeholder { color: var(--text-3); }
        .live-chat-widget__input:focus {
          border-color: var(--cyan);
          box-shadow: 0 0 0 4px rgba(0,212,255,0.08);
        }
        .live-chat-widget__send {
          min-width: 112px;
          height: 52px;
          padding: 0 1rem;
          border: none;
          border-radius: 16px;
          background: var(--grad-brand);
          color: #050d1a;
          font-weight: 800;
          cursor: pointer;
        }
        .live-chat-widget__send:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .live-chat-widget__note {
          font-size: 0.72rem;
          color: var(--text-3);
          line-height: 1.5;
        }
      `}</style>

      <div className="live-chat-widget__header">
        <div className="live-chat-widget__identity">
          <div className="live-chat-widget__avatar">CS</div>
          <div style={{ minWidth: 0 }}>
            <div className="live-chat-widget__title">Hỗ trợ trực tiếp</div>
            <div className="live-chat-widget__subtitle">
              {booting ? "Đang khôi phục phiên chat…" : session?.subject || "Kết nối nhân viên tư vấn"}
            </div>
          </div>
        </div>
        <div className="live-chat-widget__status">
          <span className="live-chat-widget__status-dot" />
          {statusLabel}
        </div>
      </div>

      <div className="live-chat-widget__messages">
        {messages.length === 0 ? (
          <div className="live-chat-widget__empty">
            <div className="live-chat-widget__empty-card">
              <strong style={{ display: "block", color: "var(--text)", marginBottom: "0.35rem" }}>Bạn cần hỗ trợ gì?</strong>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Gửi câu hỏi về đơn hàng, linh kiện, bảo hành hoặc tư vấn cấu hình. Nhân viên sẽ phản hồi ngay trong khung chat này.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isCustomer = message.senderRole === "customer";
            const isAdmin = message.senderRole === "admin";
            const bubbleClass = isCustomer
              ? "live-chat-widget__bubble live-chat-widget__bubble--customer"
              : isAdmin
                ? "live-chat-widget__bubble live-chat-widget__bubble--admin"
                : "live-chat-widget__bubble live-chat-widget__bubble--system";

            return (
              <div key={message.id} className={bubbleClass}>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{message.content}</div>
                <div className="live-chat-widget__bubble-meta">
                  <span>{message.senderName}</span>
                  <span>{new Date(message.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            );
          })
        )}
        {loading && (
          <div className="live-chat-widget__bubble live-chat-widget__bubble--system">
            Đang gửi tin nhắn…
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="live-chat-widget__composer">
        <div className="live-chat-widget__input-row">
          <textarea
            className="live-chat-widget__input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Nhập câu hỏi hoặc mô tả vấn đề của bạn..."
            rows={2}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void sendMessage();
              }
            }}
          />
          <button className="live-chat-widget__send" type="button" onClick={() => void sendMessage()} disabled={loading || !input.trim()}>
            Gửi
          </button>
        </div>
        <div className="live-chat-widget__note">
          Live chat đang dùng cơ chế polling trong Next app để đồng bộ khách hàng và admin khi chưa có websocket backend riêng.
        </div>
      </div>
    </div>
  );
};

export default LiveSupportChat;