"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  deleteLiveChatSession,
  fetchLiveChatMessages,
  fetchLiveChatSessions,
  sendLiveChatMessage,
} from "@/services/live-chat.api";
import { emitLiveChatSync, subscribeLiveChatSync } from "@/lib/liveChatSync";
import type { LiveChatMessage, LiveChatSessionSummary } from "@/types/live-chat.type";

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Không thể đọc ảnh đã chọn"));
    reader.readAsDataURL(file);
  });

const sameMessages = (a: LiveChatMessage[], b: LiveChatMessage[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (
      a[i].id !== b[i].id ||
      a[i].timestamp !== b[i].timestamp ||
      a[i].content !== b[i].content ||
      a[i].messageType !== b[i].messageType ||
      a[i].imageUrl !== b[i].imageUrl
    ) {
      return false;
    }
  }
  return true;
};

const StaffLiveChatPanel = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<LiveChatSessionSummary[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const selectedSessionIdRef = useRef<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [pendingReplyImage, setPendingReplyImage] = useState<string | null>(null);

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) || null,
    [sessions, selectedSessionId]
  );

  useEffect(() => {
    selectedSessionIdRef.current = selectedSessionId;
  }, [selectedSessionId]);

  const refreshSessions = async (preferCurrent = true) => {
    const data = await fetchLiveChatSessions({});
    setSessions(data.sessions);

    if (!selectedSessionIdRef.current && data.sessions[0]) {
      setSelectedSessionId(data.sessions[0].id);
      return data.sessions[0].id;
    }

    if (preferCurrent && selectedSessionIdRef.current) {
      const stillExists = data.sessions.some((session) => session.id === selectedSessionIdRef.current);
      if (!stillExists && data.sessions[0]) {
        setSelectedSessionId(data.sessions[0].id);
        return data.sessions[0].id;
      }

      if (!stillExists && !data.sessions[0]) {
        setSelectedSessionId(null);
        return null;
      }
    }

    return selectedSessionIdRef.current;
  };

  const refreshMessages = async (
    sessionId: string,
    options?: { showLoading?: boolean }
  ) => {
    const showLoading = options?.showLoading ?? true;
    if (showLoading) {
      setMessageLoading(true);
    }
    try {
      const data = await fetchLiveChatMessages(sessionId, "admin");
      setMessages((prev) => (sameMessages(prev, data.messages) ? prev : data.messages));
      setSessions((prev) => prev.map((session) => (session.id === sessionId ? data.session : session)));
    } finally {
      if (showLoading) {
        setMessageLoading(false);
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    let cancelled = false;
    let delay = 2500;

    const bootstrap = async () => {
      try {
        const data = await fetchLiveChatSessions({});
        if (!mounted) return;
        setSessions(data.sessions);
        if (data.sessions[0]) {
          setSelectedSessionId(data.sessions[0].id);
          const messagesData = await fetchLiveChatMessages(data.sessions[0].id, "admin");
          if (!mounted) return;
          setMessages(messagesData.messages);
          setSessions((prev) => prev.map((session) => (session.id === data.sessions[0].id ? messagesData.session : session)));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const poll = async () => {
      if (cancelled) return;
      try {
        const nextSelectedId = await refreshSessions(true);
        if (cancelled) return;
        if (nextSelectedId) {
          await refreshMessages(nextSelectedId, { showLoading: false });
        } else {
          setMessages([]);
        }
        delay = 2500;
      } catch {
        delay = Math.min(12000, Math.floor(delay * 1.6));
      }
      if (cancelled) return;
      window.setTimeout(poll, delay);
    };

    void bootstrap();
    poll();

    return () => {
      mounted = false;
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeLiveChatSync((event) => {
      if (!event.sessionId) {
        void refreshSessions(true);
        return;
      }

      const currentSessionId = selectedSessionIdRef.current;
      if (!currentSessionId || currentSessionId === event.sessionId) {
        void refreshSessions(true).then((sessionId) => {
          if (sessionId) {
            void refreshMessages(sessionId, { showLoading: false });
          }
        });
      } else {
        void refreshSessions(true);
      }
    });

    return unsubscribe;
  }, []);

  const pushSystemMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `error-${Date.now()}`,
        sessionId: selectedSessionIdRef.current || "pending",
        senderRole: "system",
        senderName: "Hệ thống",
        content: text,
        messageType: "text",
        timestamp: new Date().toISOString(),
        readByCustomer: true,
        readByAdmin: true,
      },
    ]);
  };

  const sendReplyPayload = async (payload: {
    content?: string;
    messageType?: "text" | "image";
    imageUrl?: string;
  }) => {
    if (!selectedSessionId) return;
    const content = (payload.content || "").trim();
    const messageType = payload.messageType === "image" ? "image" : "text";
    if (messageType === "text" && !content) return;

    if (messageType === "text") {
      setReply("");
    }

    try {
      const result = await sendLiveChatMessage(selectedSessionId, {
        senderRole: "admin",
        senderName: user?.name || "Support",
        content,
        messageType,
        imageUrl: payload.imageUrl || (pendingReplyImage && messageType === "image" ? pendingReplyImage : undefined),
      });
      setMessages(result.messages);
      setSessions((prev) => prev.map((session) => (session.id === selectedSessionId ? result.session : session)));
      emitLiveChatSync({ sessionId: selectedSessionId, source: "admin" });
      setPendingReplyImage(null);
    } catch (error: any) {
      pushSystemMessage(error?.message || "Không thể gửi phản hồi lúc này.");
    }
  };

  const handleSendReply = async () => {
    if (pendingReplyImage) {
      await sendReplyPayload({ content: reply, messageType: "image", imageUrl: pendingReplyImage });
      return;
    }

    await sendReplyPayload({ content: reply, messageType: "text" });
  };

  const handleSelectReplyImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!selectedSessionId) return;

    if (!file.type.startsWith("image/")) {
      pushSystemMessage("Vui lòng chọn file ảnh hợp lệ.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      pushSystemMessage("Ảnh tối đa 2MB để gửi nhanh hơn.");
      return;
    }

    try {
      const imageUrl = await toDataUrl(file);
      setPendingReplyImage(imageUrl);
    } catch (error: any) {
      pushSystemMessage(error?.message || "Không thể gửi ảnh lúc này.");
    }
  };

  const handlePasteReply = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    try {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            if (file.size > MAX_IMAGE_SIZE) {
              pushSystemMessage("Ảnh tối đa 2MB để gửi nhanh hơn.");
              return;
            }
            const data = await toDataUrl(file);
            setPendingReplyImage(data);
            return;
          }
        }
      }
    } catch (err) {
      // ignore
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (user?.role !== "admin") {
      pushSystemMessage("Chỉ administrator mới có quyền xóa cuộc hội thoại.");
      return;
    }

    const session = sessions.find((item) => item.id === sessionId);
    if (!session) return;

    const confirmed = window.confirm(`Xóa cuộc hội thoại của ${session.userName}? Hành động này không thể hoàn tác.`);
    if (!confirmed) return;

    await deleteLiveChatSession(sessionId);

    const wasSelected = selectedSessionId === sessionId;
    if (wasSelected) {
      setSelectedSessionId(null);
      selectedSessionIdRef.current = null;
      setMessages([]);
      setReply("");
    }

    const nextSessionId = await refreshSessions(true);
    if (wasSelected) {
      if (nextSessionId) {
        await refreshMessages(nextSessionId);
      } else {
        setMessages([]);
      }
    }

    emitLiveChatSync({ sessionId, source: "admin" });
  };

  const statusLabel = selectedSession
    ? selectedSession.status === "active"
      ? "Đang hỗ trợ trực tiếp"
      : selectedSession.status === "closed"
        ? "Phiên đã đóng"
        : "Đang chờ phản hồi"
    : "Sẵn sàng tiếp nhận";

  useEffect(() => {
    if (!selectedSessionId) {
      setMessages([]);
      return;
    }
    void refreshMessages(selectedSessionId, { showLoading: true });
  }, [selectedSessionId]);

  return (
    <div className="live-chat-widget staff-live-chat-widget">
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
        .staff-live-chat-widget__body {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: 210px minmax(0, 1fr);
          background: radial-gradient(circle at top left, rgba(0,212,255,0.04), transparent 28%), radial-gradient(circle at bottom right, rgba(168,85,247,0.05), transparent 26%);
        }
        .staff-live-chat-widget__sessions {
          border-right: 1px solid var(--border);
          background: rgba(255,255,255,0.02);
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          min-height: 0;
          padding: 0.75rem;
        }
        .staff-live-chat-widget__sessions-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.72rem;
          color: var(--text-3);
        }
        .staff-live-chat-widget__sessions-list {
          display: grid;
          gap: 0.55rem;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 0.15rem;
          scrollbar-width: thin;
        }
        .staff-live-chat-widget__session {
          border: 1px solid var(--border);
          border-radius: 14px;
          background: rgba(255,255,255,0.02);
          padding: 0.48rem;
          display: flex;
          gap: 0.45rem;
        }
        .staff-live-chat-widget__session--active {
          border-color: rgba(0,212,255,0.35);
          background: rgba(0,212,255,0.1);
        }
        .staff-live-chat-widget__session-main {
          flex: 1;
          min-width: 0;
          border: none;
          background: transparent;
          color: inherit;
          text-align: left;
          padding: 0;
          cursor: pointer;
        }
        .staff-live-chat-widget__session-name {
          color: var(--text);
          font-weight: 700;
          font-size: 0.8rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .staff-live-chat-widget__session-msg {
          color: var(--text-3);
          font-size: 0.7rem;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .staff-live-chat-widget__session-meta {
          margin-top: 6px;
          color: var(--text-3);
          font-size: 0.64rem;
          display: flex;
          justify-content: space-between;
          gap: 4px;
        }
        .staff-live-chat-widget__session-delete {
          width: 24px;
          height: 24px;
          border-radius: 9px;
          border: 1px solid rgba(248,113,113,0.35);
          background: rgba(248,113,113,0.12);
          color: #fecaca;
          cursor: pointer;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          align-self: center;
        }
        .staff-live-chat-widget__main {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .staff-live-chat-widget__current {
          padding: 0.75rem 0.9rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.6rem;
          background: rgba(255,255,255,0.015);
        }
        .staff-live-chat-widget__current-delete {
          flex-shrink: 0;
          padding: 0.45rem 0.7rem;
          border-radius: 12px;
          border: 1px solid rgba(248,113,113,0.35);
          background: rgba(248,113,113,0.1);
          color: #fecaca;
          font-weight: 700;
          cursor: pointer;
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
          min-height: 280px;
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
          background: linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.08));
          border-color: rgba(168,85,247,0.2);
        }
        .live-chat-widget__bubble--admin {
          margin-left: auto;
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
        .live-chat-widget__image {
          display: block;
          max-width: 320px;
          max-height: 240px;
          width: auto;
          height: auto;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.18);
          object-fit: cover;
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
          height: 52px;
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
        .live-chat-widget__attach {
          min-width: 52px;
          height: 52px;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: rgba(255,255,255,0.05);
          color: var(--text);
          font-size: 1.1rem;
          cursor: pointer;
        }
        .live-chat-widget__attach:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
      `}</style>

      <div className="live-chat-widget__header">
        <div className="live-chat-widget__identity">
          <div className="live-chat-widget__avatar">ST</div>
          <div style={{ minWidth: 0 }}>
            <div className="live-chat-widget__title">Live chat nhân viên</div>
            <div className="live-chat-widget__subtitle">
              {selectedSession ? `${selectedSession.userName} • ${selectedSession.subject}` : "Chọn phiên khách hàng để trả lời"}
            </div>
          </div>
        </div>
        <div className="live-chat-widget__status">
          <span className="live-chat-widget__status-dot" />
          {statusLabel}
        </div>
      </div>

      <div className="staff-live-chat-widget__body">
        <aside className="staff-live-chat-widget__sessions">
          <div className="staff-live-chat-widget__sessions-head">
            <span>Cuộc hội thoại khách</span>
            <span>{sessions.length}</span>
          </div>
          <div className="staff-live-chat-widget__sessions-list">
            {loading ? (
              <div style={{ color: "var(--text-2)", fontSize: "0.75rem", padding: "0.35rem" }}>Đang tải phiên…</div>
            ) : sessions.length === 0 ? (
              <div style={{ color: "var(--text-2)", fontSize: "0.75rem", padding: "0.35rem" }}>Chưa có phiên nào.</div>
            ) : (
              sessions.map((session) => {
                const active = session.id === selectedSessionId;
                return (
                  <div
                    key={session.id}
                    className={`staff-live-chat-widget__session${active ? " staff-live-chat-widget__session--active" : ""}`}
                  >
                    <button
                      type="button"
                      className="staff-live-chat-widget__session-main"
                      onClick={() => setSelectedSessionId(session.id)}
                    >
                      <div className="staff-live-chat-widget__session-name">{session.userName}</div>
                      <div className="staff-live-chat-widget__session-msg">{session.latestMessage || session.subject}</div>
                      <div className="staff-live-chat-widget__session-meta">
                        <span>{session.status.toUpperCase()}</span>
                        <span>{formatTime(session.lastMessageAt)}</span>
                      </div>
                    </button>
                    {user?.role === "admin" ? (
                      <button
                        type="button"
                        className="staff-live-chat-widget__session-delete"
                        aria-label={`Xóa cuộc hội thoại của ${session.userName}`}
                        onClick={() => void handleDeleteSession(session.id)}
                      >
                        ×
                      </button>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </aside>

        <section className="staff-live-chat-widget__main">
          <div className="staff-live-chat-widget__current">
            <div>
              <div className="live-chat-widget__title">{selectedSession?.userName || "Chưa chọn phiên"}</div>
              <div className="live-chat-widget__subtitle">
                {selectedSession ? selectedSession.subject : "Chọn một khách hàng để xem nội dung chat"}
              </div>
            </div>
            {selectedSession && user?.role === "admin" ? (
              <button
                type="button"
                className="staff-live-chat-widget__current-delete"
                onClick={() => void handleDeleteSession(selectedSession.id)}
              >
                Xóa
              </button>
            ) : null}
          </div>

          <div className="live-chat-widget__messages">
        {!selectedSession ? (
          <div className="live-chat-widget__empty">
            <div className="live-chat-widget__empty-card">
              <strong style={{ display: "block", color: "var(--text)", marginBottom: "0.35rem" }}>Chọn một cuộc hội thoại</strong>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Staff có thể chuyển nhanh giữa các khách hàng trong danh sách phía trên để trả lời đúng từng phiên.
              </p>
            </div>
          </div>
        ) : messageLoading ? (
          <div className="live-chat-widget__bubble live-chat-widget__bubble--system">Đang tải tin nhắn…</div>
        ) : messages.length === 0 ? (
          <div className="live-chat-widget__empty">
            <div className="live-chat-widget__empty-card">Chưa có tin nhắn trong phiên này.</div>
          </div>
        ) : (
          messages.map((message) => {
            const isAdmin = message.senderRole === "admin";
            const bubbleClass = isAdmin
              ? "live-chat-widget__bubble live-chat-widget__bubble--admin"
              : message.senderRole === "customer"
                ? "live-chat-widget__bubble live-chat-widget__bubble--customer"
                : "live-chat-widget__bubble live-chat-widget__bubble--system";

            return (
              <div key={message.id} className={bubbleClass}>
                {message.messageType === "image" && message.imageUrl ? (
                  <a href={message.imageUrl} target="_blank" rel="noreferrer">
                    <img className="live-chat-widget__image" src={message.imageUrl} alt="Ảnh đã gửi" />
                  </a>
                ) : (
                  <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{message.content}</div>
                )}
                <div className="live-chat-widget__bubble-meta">
                  <span>{message.senderName}</span>
                  <span>{formatTime(message.timestamp)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

          <div className="live-chat-widget__composer">
            <div className="live-chat-widget__input-row">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(event) => void handleSelectReplyImage(event)}
              />
              <textarea
                className="live-chat-widget__input"
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                placeholder={selectedSession ? "Soạn phản hồi…" : "Chọn phiên để phản hồi"}
                disabled={!selectedSessionId}
                rows={2}
                onPaste={handlePasteReply}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void handleSendReply();
                  }
                }}
              />
              <button
                className="live-chat-widget__attach"
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={!selectedSessionId}
                aria-label="Gửi ảnh"
                title="Gửi ảnh"
              >
                🖼️
              </button>
              <button
                className="live-chat-widget__send"
                type="button"
                onClick={() => void handleSendReply()}
                disabled={!selectedSessionId || (!reply.trim() && !pendingReplyImage)}
              >
                Gửi phản hồi
              </button>
            </div>
            {pendingReplyImage ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 0' }}>
                <img src={pendingReplyImage} alt="Preview" style={{ maxWidth: 160, maxHeight: 120, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <button type="button" onClick={() => setPendingReplyImage(null)} style={{ padding: '0.35rem 0.6rem', borderRadius: 10, border: 'none', background: 'rgba(255,255,255,0.04)', cursor: 'pointer' }}>Xóa ảnh</button>
                  <div style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>Ảnh sẽ được gửi cùng phản hồi.</div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StaffLiveChatPanel;
