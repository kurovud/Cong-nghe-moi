import type {
  ChatAnalyticsResponse,
  ChatFeedbackRequest,
  ChatRequest,
  ChatResponse,
} from "@/types/chat.type";
import type { Product, PrebuiltPC } from "@/types/product.type";
import { http } from "./http";
import { normalizeProductImageList } from "@/lib/product-image";

const API_BASE = "/api";

/* ═══════════════════════════════════════════════════
   CHAT API
   ═══════════════════════════════════════════════════ */
export const sendChatMessage = async (
  request: ChatRequest
): Promise<ChatResponse> => {
  const response = await http.post<any>("/api/chat", request);
  const payload = response?.data ?? {};
  return {
    answer: payload.message ?? "",
    responseId: payload.responseId,
    agent: payload.agent,
    contentType: "text",
    products: normalizeProductImageList(payload.products ?? []),
    sources: payload.sources ?? [],
    intent: payload.intent ?? "general_support",
    conversationId: payload.sessionId ?? request.conversationId ?? "",
    suggestedQuestions: payload.suggestedQuestions ?? [],
  };
};

export const sendChatFeedback = async (
  body: ChatFeedbackRequest
): Promise<{ accepted: boolean; rating?: "like" | "dislike" }> => {
  const response = await http.post<any>("/api/chat/feedback", body);
  return response?.data ?? { accepted: false };
};

export const fetchChatAnalytics = async (): Promise<ChatAnalyticsResponse> => {
  const response = await http.get<any>("/api/analytics");
  return response?.data;
};

/* ═══════════════════════════════════════════════════
   PRODUCT API
   ═══════════════════════════════════════════════════ */
interface ProductsResponse {
  products: Product[];
  total: number;
}

export const getProducts = async (params?: {
  category?: string;
  budget?: number;
  q?: string;
  limit?: number;
}): Promise<ProductsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.budget) searchParams.set("budget", String(params.budget));
  if (params?.q) searchParams.set("q", params.q);
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const res = await fetch(`${API_BASE}/products?${searchParams.toString()}`);
  if (!res.ok) throw new Error(`Products API error: ${res.status}`);
  const data = await res.json();
  return {
    ...data,
    products: normalizeProductImageList(data?.products ?? []),
  };
};

/* ═══════════════════════════════════════════════════
   BUILDS API
   ═══════════════════════════════════════════════════ */
interface BuildsResponse {
  builds: PrebuiltPC[];
  total: number;
}

export const getBuilds = async (params?: {
  budget?: number;
  purpose?: string;
}): Promise<BuildsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.budget) searchParams.set("budget", String(params.budget));
  if (params?.purpose) searchParams.set("purpose", params.purpose);

  const res = await fetch(`${API_BASE}/builds?${searchParams.toString()}`);
  if (!res.ok) throw new Error(`Builds API error: ${res.status}`);
  return res.json();
};
