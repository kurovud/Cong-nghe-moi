import { useState, useCallback, useRef } from "react";
import type {
  ChatMessage,
  ChatResponse,
  MessageContentType
} from "@/types/chat.type";
import { sendChatMessage } from "@/services/chatbot.api";

interface UseChatOptions {
  initialMessages?: ChatMessage[];
}

export const useChat = (options?: UseChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>(
    options?.initialMessages ?? [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Xin chào! 👋 Tôi là trợ lý AI của PC Builder Shop. Hỏi tôi bất kỳ điều gì về linh kiện PC, laptop, cấu hình build hoặc hướng dẫn lắp ráp.",
        contentType: "text",
        timestamp: new Date().toISOString()
      }
    ]
  );
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Tư vấn cấu hình PC gaming 15 triệu",
    "So sánh RTX 4060 Ti và RX 7600",
    "Hướng dẫn lắp ráp PC từ A-Z",
    "Laptop gaming nào tốt dưới 25 triệu?"
  ]);
  const conversationIdRef = useRef<string>("");

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
        contentType: "text",
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, userMessage]);
      setSuggestions([]);
      setLoading(true);

      try {
        const data: ChatResponse = await sendChatMessage({
          message: text,
          conversationId: conversationIdRef.current || undefined
        });

        conversationIdRef.current = data.conversationId;

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.answer,
          contentType: data.contentType,
          products: data.products,
          assemblySteps: data.assemblySteps,
          comparison: data.comparison,
          sources: data.sources,
          timestamp: new Date().toISOString()
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (data.suggestedQuestions) {
          setSuggestions(data.suggestedQuestions);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.",
            contentType: "text" as MessageContentType,
            timestamp: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Xin chào! 👋 Cuộc trò chuyện mới. Tôi sẵn sàng hỗ trợ bạn!",
        contentType: "text",
        timestamp: new Date().toISOString()
      }
    ]);
    conversationIdRef.current = "";
    setSuggestions([
      "Tư vấn cấu hình PC gaming 15 triệu",
      "So sánh RTX 4060 Ti và RX 7600",
      "Hướng dẫn lắp ráp PC từ A-Z"
    ]);
  }, []);

  return {
    messages,
    loading,
    suggestions,
    send,
    clearMessages
  };
};
