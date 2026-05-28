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
  // Quick heuristic: if user asks for product recommendations (keywords like 'mua', 'tìm', 'dưới', 'giá', 'build')
  // pre-fetch relevant products and include them alongside the chat service's response.
  const q = String(request.message || "").toLowerCase();
  const productHints: any[] = [];
  let assemblySteps: ChatResponse["assemblySteps"] = undefined;

  try {
    const wantsProducts = /mua|tìm|tư vấn|build|ngân sách|dưới|trên|giá|màn hình|cpu|gpu|ram/.test(q);
    if (wantsProducts) {
      // try to extract a short query or budget
      const rangeMatch = q.match(/(\d+[\.,]?\d*)\s*[-–]\s*(\d+[\.,]?\d*)\s*(triệu|m|k|nghìn)?/i);
      const budgetMatch = q.match(/(dưới|nhỏ hơn|dưới khoảng)\s*(\d+[\.,]?\d*)\s*(k|nghìn|triệu|m|vnđ|đ|vnd)?/i);
      const budget = rangeMatch
        ? Math.floor(
            ((Number(rangeMatch[1].replace(/\.|,/g, "")) + Number(rangeMatch[2].replace(/\.|,/g, ""))) / 2) *
              (/(k|nghìn)/i.test(rangeMatch[3] || "") ? 1000 : (/(triệu|m)/i.test(rangeMatch[3] || "") ? 1000000 : 1))
          )
        : budgetMatch
          ? Math.floor(Number(budgetMatch[2].replace(/\.|,/g, "")) * (/(k|nghìn)/i.test(budgetMatch[3] || "") ? 1000 : (/(triệu|m)/i.test(budgetMatch[3] || "") ? 1000000 : 1)))
          : request.context?.budget;
      const qterm = q.replace(/(mua|tìm|tư vấn|xin tư vấn|help|giúp|build|ngân sách|dưới|trên|giá)/g, "").trim().slice(0, 120);
      try {
        // if we detected a budget, run the assembly engine for a deterministic build
        if (budget) {
          const { assembleBuildByBudget } = await import("@/lib/assemblyEngine");
          const build = assembleBuildByBudget(budget, q.includes('gaming') ? 'gaming' : 'general');
          productHints.push(...(build.selected ?? []));
          assemblySteps = build.steps;
        }
        const productsResp = await getProducts({ q: qterm || undefined, budget: budget ?? undefined, limit: 6 });
        productHints.push(...(productsResp.products ?? []));
      } catch {
        // ignore product API failures
      }
    }
  } catch {
    // ignore heuristics errors
  }

  const response = await http.post<any>("/api/chat", request);
  const payload = response?.data ?? {};

  // merge product lists (dedupe by id)
  const backendProducts = normalizeProductImageList(payload.products ?? []);
  const mergedMap = new Map<string, any>();
  [...productHints, ...backendProducts].forEach((p: any) => {
    if (!p || !p.id) return;
    if (!mergedMap.has(p.id)) mergedMap.set(p.id, p);
  });

  // if assembly steps were produced earlier, attach them to the response
  assemblySteps = assemblySteps ?? payload.assemblySteps ?? undefined;

  return {
    answer: payload.message ?? "",
    responseId: payload.responseId,
    agent: payload.agent,
    contentType: "text",
    products: Array.from(mergedMap.values()),
    assemblySteps,
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
