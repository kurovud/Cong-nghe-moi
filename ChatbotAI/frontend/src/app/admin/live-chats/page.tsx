"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  updateLiveChatSession,
  fetchLiveChatMessages,
  fetchLiveChatSessions,
  sendLiveChatMessage,
} from "@/services/live-chat.api";
import type { LiveChatMessage, LiveChatSessionSummary } from "@/types/live-chat.type";

const formatTime = (value: string) =>
  new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });

const AdminLiveChatsPage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<LiveChatSessionSummary[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [reply, setReply] = useState("");

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) || null,
    [sessions, selectedSessionId]
  );

  const refreshSessions = async (keepSelection = true) => {
    const data = await fetchLiveChatSessions({});
    setSessions(data.sessions);

    if (!keepSelection && data.sessions[0]) {
      setSelectedSessionId(data.sessions[0].id);
    }

    if (!selectedSessionId && data.sessions[0]) {
      setSelectedSessionId(data.sessions[0].id);
    }
  };

  const refreshMessages = async (sessionId: string) => {
    setMessageLoading(true);
    try {
      const data = await fetchLiveChatMessages(sessionId, "admin");
      setMessages(data.messages);
      setSessions((prev) => prev.map((session) => (session.id === sessionId ? data.session : session)));
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

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

    void bootstrap();

    let cancelled = false;
    let delay = 4000;

    const poll = async () => {
      if (cancelled) return;
      try {
        const data = await fetchLiveChatSessions({});
        if (cancelled) return;
        setSessions(data.sessions);
        if (selectedSessionId) {
          const stillExists = data.sessions.some((session) => session.id === selectedSessionId);
          if (stillExists) {
            const messagesData = await fetchLiveChatMessages(selectedSessionId, "admin");
            if (cancelled) return;
            setMessages(messagesData.messages);
            setSessions((prev) => prev.map((session) => (session.id === selectedSessionId ? messagesData.session : session)));
          }
        } else if (data.sessions[0]) {
          setSelectedSessionId(data.sessions[0].id);
        }
        delay = 4000; // reset on success
      } catch {
        delay = Math.min(15000, Math.floor(delay * 1.7));
      }
      if (cancelled) return;
      window.setTimeout(poll, delay + Math.round(Math.random() * 500));
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [selectedSessionId]);

  useEffect(() => {
    if (selectedSessionId) {
      void refreshMessages(selectedSessionId);
    } else {
      setMessages([]);
    }
  }, [selectedSessionId]);

  const handleSendReply = async () => {
    if (!selectedSessionId || !reply.trim()) return;

    const text = reply.trim();
    setReply("");
    const result = await sendLiveChatMessage(selectedSessionId, {
      senderRole: "admin",
      senderName: user?.name || "Support",
      content: text,
    });
    setMessages(result.messages);
    setSessions((prev) => prev.map((session) => (session.id === selectedSessionId ? result.session : session)));
  };

  const handleCloseSession = async () => {
    if (!selectedSessionId) return;
    await updateLiveChatSession(selectedSessionId, { action: "close" });
    await refreshSessions();
    await refreshMessages(selectedSessionId);
  };

  const stats = [
    { label: "Tổng phiên", value: sessions.length },
    { label: "Đang chờ", value: sessions.filter((session) => session.status === "waiting").length },
    { label: "Đang hoạt động", value: sessions.filter((session) => session.status === "active").length },
    { label: "Đã đóng", value: sessions.filter((session) => session.status === "closed").length },
  ];

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <AdminHeader title="Live Chat" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1rem" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ padding: "1rem 1.1rem", borderRadius: 16, border: "1px solid var(--border)", background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))" }}>
            <div style={{ color: "var(--text-3)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>{stat.label}</div>
            <div style={{ color: "var(--text)", fontSize: "1.6rem", fontWeight: 900, fontFamily: "var(--font-heading)" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px minmax(0, 1fr)", gap: "1rem", minHeight: "72vh" }}>
        <aside style={{ border: "1px solid var(--border)", borderRadius: 18, background: "var(--surface)", overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.1rem", borderBottom: "1px solid var(--border)" }}>
            <div style={{ color: "var(--text)", fontWeight: 800, marginBottom: "0.25rem" }}>Phiên hỗ trợ</div>
            <div style={{ color: "var(--text-3)", fontSize: "0.82rem" }}>Khách gửi tin nhắn sẽ tự động đẩy lên đây.</div>
          </div>

          <div style={{ maxHeight: "calc(72vh - 64px)", overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: "1.25rem", color: "var(--text-2)" }}>Đang tải…</div>
            ) : sessions.length === 0 ? (
              <div style={{ padding: "1.25rem", color: "var(--text-2)" }}>Chưa có phiên live chat nào.</div>
            ) : (
              sessions.map((session) => {
                const isSelected = session.id === selectedSessionId;
                return (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => setSelectedSessionId(session.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "1rem 1.1rem",
                      border: "none",
                      borderBottom: "1px solid var(--border)",
                      background: isSelected ? "rgba(0,212,255,0.08)" : "transparent",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.35rem" }}>
                      <strong style={{ color: "var(--text)" }}>{session.userName}</strong>
                      <span style={{ fontSize: "0.72rem", color: session.unreadForAdmin > 0 ? "var(--orange)" : "var(--text-3)" }}>
                        {session.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ color: "var(--text-3)", fontSize: "0.82rem", lineHeight: 1.5 }}>
                      {session.latestMessage || session.subject}
                    </div>
                    <div style={{ marginTop: "0.45rem", display: "flex", justifyContent: "space-between", gap: "0.5rem", color: "var(--text-3)", fontSize: "0.72rem" }}>
                      <span>{formatTime(session.lastMessageAt)}</span>
                      <span>{session.unreadForAdmin > 0 ? `${session.unreadForAdmin} mới` : `${session.messageCount} tin`}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section style={{ border: "1px solid var(--border)", borderRadius: 18, background: "var(--surface)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.1rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
            <div>
              <div style={{ color: "var(--text)", fontWeight: 800, marginBottom: "0.15rem" }}>
                {selectedSession?.userName || "Chưa chọn phiên"}
              </div>
              <div style={{ color: "var(--text-3)", fontSize: "0.82rem" }}>
                {selectedSession ? `${selectedSession.subject} · ${selectedSession.userEmail || "Không có email"}` : "Chọn một phiên ở cột bên trái"}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ padding: "0.35rem 0.7rem", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700, border: "1px solid var(--border)", color: "var(--text-2)" }}>
                {selectedSession?.status?.toUpperCase() || "IDLE"}
              </span>
              <button
                type="button"
                onClick={() => void handleCloseSession()}
                disabled={!selectedSessionId}
                style={{
                  padding: "0.65rem 0.95rem",
                  borderRadius: 12,
                  border: "1px solid rgba(239,68,68,0.25)",
                  background: "rgba(239,68,68,0.08)",
                  color: "var(--red)",
                  fontWeight: 700,
                  cursor: selectedSessionId ? "pointer" : "not-allowed",
                }}
              >
                Đóng phiên
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "grid", gap: "0.85rem" }}>
            {messageLoading ? (
              <div style={{ color: "var(--text-2)" }}>Đang tải tin nhắn…</div>
            ) : messages.length === 0 ? (
              <div style={{ color: "var(--text-2)" }}>Phiên này chưa có tin nhắn nào.</div>
            ) : (
              messages.map((message) => {
                const isAdmin = message.senderRole === "admin";
                const isCustomer = message.senderRole === "customer";
                return (
                  <div key={message.id} style={{ display: "flex", justifyContent: isAdmin ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "78%",
                      padding: "0.85rem 0.95rem",
                      borderRadius: 16,
                      background: isAdmin ? "linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.06))" : isCustomer ? "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.06))" : "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                    }}>
                      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: "var(--text)" }}>{message.content}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", marginTop: "0.45rem", fontSize: "0.68rem", color: "var(--text-3)" }}>
                        <span>{message.senderName}</span>
                        <span>{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ borderTop: "1px solid var(--border)", padding: "0.95rem", display: "grid", gap: "0.75rem" }}>
            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder={selectedSession ? "Soạn phản hồi cho khách hàng…" : "Chọn một phiên để phản hồi"}
              disabled={!selectedSessionId}
              rows={3}
              style={{
                width: "100%",
                padding: "0.9rem 1rem",
                borderRadius: 16,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.03)",
                color: "var(--text)",
                resize: "vertical",
                outline: "none",
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void handleSendReply();
                }
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ color: "var(--text-3)", fontSize: "0.8rem", lineHeight: 1.5 }}>
                Tin nhắn sẽ tự đồng bộ với khung chat khách hàng sau vài giây polling.
              </div>
              <button
                type="button"
                onClick={() => void handleSendReply()}
                disabled={!selectedSessionId || !reply.trim()}
                style={{
                  minWidth: 120,
                  padding: "0.85rem 1rem",
                  borderRadius: 14,
                  border: "none",
                  background: "var(--grad-brand)",
                  color: "#050d1a",
                  fontWeight: 800,
                  cursor: !selectedSessionId || !reply.trim() ? "not-allowed" : "pointer",
                }}
              >
                Gửi phản hồi
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminLiveChatsPage;