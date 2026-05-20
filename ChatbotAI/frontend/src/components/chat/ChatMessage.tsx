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
    <div className={`chat-message ${isUser ? "chat-message--user" : "chat-message--assistant"}`}>
      <div className="chat-message__avatar">
        {isUser ? "👤" : "🤖"}
      </div>
      <div className="chat-message__content">
        <div className="chat-message__bubble">
          {/* Render text with basic markdown support */}
          <div
            className="chat-message__text"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
          />

          {/* Product cards */}
          {message.products && message.products.length > 0 && (
            <div className="chat-message__products">
              {message.products.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          )}

          {/* Assembly steps */}
          {message.assemblySteps && message.assemblySteps.length > 0 && (
            <AssemblyGuide steps={message.assemblySteps} />
          )}

          {/* Sources */}
          {message.sources && message.sources.length > 0 && (
            <div className="chat-message__sources">
              {message.sources.map((source, i) => (
                <span key={i} className="tag">{source}</span>
              ))}
            </div>
          )}

          {!isUser && message.responseId && (
            <div className="chat-message__feedback">
              <button
                type="button"
                className={`chat-message__feedback-btn ${message.feedback === "like" ? "is-active" : ""}`}
                onClick={() => onFeedback?.(message.id, "like")}
                aria-label="Hài lòng"
              >
                👍
              </button>
              <button
                type="button"
                className={`chat-message__feedback-btn ${message.feedback === "dislike" ? "is-active" : ""}`}
                onClick={() => onFeedback?.(message.id, "dislike")}
                aria-label="Không hài lòng"
              >
                👎
              </button>
            </div>
          )}
        </div>
        <div className="chat-message__time">
          {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit"
          })}
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
    // Headers
    .replace(/^### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^## (.+)$/gm, "<h3>$1</h3>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Strikethrough
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    // Code
    .replace(/`(.+?)`/g, "<code>$1</code>")
    // Table rows
    .replace(/^\|(.+)\|$/gm, (_, row) => {
      const cells = row.split("|").map((c: string) => c.trim());
      return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join("")}</tr>`;
    })
    // Bullet points
    .replace(/^[•\-] (.+)$/gm, "<li>$1</li>")
    // Numbered list
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Horizontal rule
    .replace(/^---$/gm, "<hr/>")
    // Line breaks
    .replace(/\n/g, "<br/>");
}

export default ChatMessage;
