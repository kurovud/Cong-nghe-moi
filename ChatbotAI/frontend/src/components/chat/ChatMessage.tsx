"use client";

import type { ChatMessage as ChatMessageType } from "@/types/chat.type";
import ProductCard from "./ProductCard";
import AssemblyGuide from "./AssemblyGuide";

interface Props {
  message: ChatMessageType;
  onFeedback?: (messageId: string, rating: "like" | "dislike") => void;
}

const ChatMessage = ({ message, onFeedback }: Props) => {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '0.75rem 0',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem',
          background: isUser
            ? 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.1))'
            : 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.1))',
          border: `1px solid ${isUser ? 'rgba(168,85,247,0.3)' : 'rgba(0,212,255,0.3)'}`,
          boxShadow: isUser ? '0 0 12px rgba(168,85,247,0.15)' : '0 0 12px rgba(0,212,255,0.15)',
        }}
      >
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '75%', minWidth: 0 }}>
        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: isUser ? 'var(--r-lg) var(--r-sm) var(--r-lg) var(--r-lg)' : 'var(--r-sm) var(--r-lg) var(--r-lg) var(--r-lg)',
            background: isUser
              ? 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.08))'
              : 'var(--surface)',
            border: `1px solid ${isUser ? 'rgba(168,85,247,0.2)' : 'var(--border)'}`,
            backdropFilter: 'none',
          }}
        >
          {/* Text */}
          <div
            style={{
              fontSize: '0.875rem',
              lineHeight: 1.7,
              color: 'var(--text)',
              wordBreak: 'break-word',
            }}
            className="chat-message__text"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
          />

          {/* Product cards */}
          {message.products && message.products.length > 0 && (
            <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.75rem' }}>
              {message.products.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          )}

          {/* Assembly steps */}
          {message.assemblySteps && message.assemblySteps.length > 0 && (
            <div style={{ marginTop: '0.75rem' }}>
              <AssemblyGuide steps={message.assemblySteps} />
            </div>
          )}

          {/* Sources */}
          {message.sources && message.sources.length > 0 && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
              {message.sources.map((source, i) => (
                <span
                  key={i}
                  style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--r-sm)',
                    background: 'rgba(0,212,255,0.06)',
                    border: '1px solid rgba(0,212,255,0.15)',
                    fontSize: '0.7rem',
                    color: 'var(--cyan)',
                    fontWeight: 600,
                  }}
                >
                  📎 {source}
                </span>
              ))}
            </div>
          )}

          {/* Feedback */}
          {!isUser && message.responseId && (
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
              {(['like', 'dislike'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onFeedback?.(message.id, type)}
                  aria-label={type === 'like' ? 'Hài lòng' : 'Không hài lòng'}
                  style={{
                    width: 30, height: 30, borderRadius: 'var(--r-sm)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${message.feedback === type ? (type === 'like' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)') : 'var(--border)'}`,
                    background: message.feedback === type ? (type === 'like' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)') : 'transparent',
                    cursor: 'pointer', fontSize: '0.85rem',
                    transition: 'all 0.2s',
                  }}
                >
                  {type === 'like' ? '👍' : '👎'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div style={{ fontSize: '0.68rem', color: 'var(--text-3)', marginTop: '0.3rem', textAlign: isUser ? 'right' : 'left', paddingLeft: isUser ? 0 : '0.25rem', paddingRight: isUser ? '0.25rem' : 0 }}>
          {new Date(message.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
};

/* ── Simple markdown → HTML ── */
function formatMarkdown(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^## (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/`(.+?)`/g, "<code style='padding:0.15rem 0.4rem;border-radius:4px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.15);color:var(--cyan);font-size:0.82em'>$1</code>")
    .replace(/^\|(.+)\|$/gm, (_, row) => {
      const cells = row.split("|").map((c: string) => c.trim());
      return `<tr>${cells.map((c: string) => `<td style="padding:0.4rem 0.6rem;border-bottom:1px solid var(--border)">${c}</td>`).join("")}</tr>`;
    })
    .replace(/^[•\-] (.+)$/gm, "<li style='margin:0.2rem 0;padding-left:0.25rem'>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li style='margin:0.2rem 0;padding-left:0.25rem'>$1</li>")
    .replace(/^---$/gm, "<hr style='border:0;border-top:1px solid var(--border);margin:0.75rem 0'/>")
    .replace(/\n/g, "<br/>");
}

export default ChatMessage;
