"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import ChatWindow from "./ChatWindow";
import LiveSupportChat from "./LiveSupportChat";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"ai" | "support">("ai");
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Đóng chat" : "Mở chat tư vấn"}
        style={{
          position: "fixed",
          right: 22,
          bottom: 22,
          zIndex: 60,
          width: 58,
          height: 58,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "var(--grad-brand)",
          color: "#050d1a",
          fontSize: "1.35rem",
          boxShadow: "0 12px 36px rgba(0,212,255,0.25)",
        }}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div style={{
          position: "fixed",
          right: 22,
          bottom: 92,
          zIndex: 60,
          width: "min(420px, calc(100vw - 1.5rem))",
          height: "min(760px, calc(100vh - 120px))",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "0.5rem",
            padding: "0.45rem",
            borderRadius: 18,
            border: "1px solid var(--border)",
            background: "rgba(5,13,26,0.92)",
            backdropFilter: "blur(16px)",
          }}>
            {[
              { key: "ai", label: "AI tư vấn", icon: "🤖" },
              { key: "support", label: "Hỗ trợ trực tiếp", icon: "🧑‍🔧" },
            ].map((item) => {
              const active = mode === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setMode(item.key as "ai" | "support")}
                  style={{
                    border: "none",
                    borderRadius: 14,
                    padding: "0.75rem 0.8rem",
                    cursor: "pointer",
                    color: active ? "#050d1a" : "var(--text)",
                    background: active ? "var(--grad-brand)" : "rgba(255,255,255,0.04)",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.45rem",
                    boxShadow: active ? "0 8px 20px rgba(0,212,255,0.18)" : "none",
                  }}
                >
                  <span>{item.icon}</span>
                  <span style={{ fontSize: "0.82rem" }}>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {mode === "ai" ? <ChatWindow /> : <LiveSupportChat />}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;
