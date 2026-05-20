"use client";

import { useState } from "react";
import ChatWindow from "./ChatWindow";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        className="floating-chat__btn"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label={isOpen ? "Đóng chat" : "Mở chat tư vấn"}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="floating-chat__panel">
          <ChatWindow />
        </div>
      )}
    </>
  );
};

export default FloatingChat;
