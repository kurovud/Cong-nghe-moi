/**
 * Chatbot Service - Q&A Dataset Based (No Gemini API)
 * Sử dụng pre-built Q&A dataset thay vì gọi Gemini API
 */

import crypto from "crypto";
import { createRedisClient, env, logger } from "@chatbot/common";
import {
  QA_DATASET,
  QAIntent,
  QAAgent,
  QARecord,
  findBestQAMatch,
} from "../data/qa-dataset";

type ChatIntent =
  | "greeting"
  | "compare"
  | "build"
  | "support"
  | "recommendation"
  | "general";
type AgentName = "advisor" | "compare" | "build" | "support";
type FeedbackRating = "like" | "dislike";

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  image?: string;
  shortDesc?: string;
  rating?: number;
  stock?: number;
  specs?: Record<string, string>;
  compatKey?: string;
}

interface BuildRequest {
  budget: number;
  purpose: "gaming" | "work" | "general";
}

interface PrebuiltBuild {
  id?: string;
  name: string;
  price?: number;
  description?: string;
  category?: string;
  components?: Record<string, string>;
}

interface RagBundle {
  context: string;
  sources: string[];
}

interface ChatRecord {
  responseId: string;
  sessionId: string;
  question: string;
  answer: string;
  intent: ChatIntent;
  agent: AgentName;
  products: string[];
  createdAt: string;
}

const redis = createRedisClient(env.REDIS_URL);
const PRODUCT_URL = env.PRODUCT_SERVICE_URL || "http://localhost:4002";

const CHAT_KEY = (sessionId: string) => `chat:${sessionId}`;
const CHAT_TTL = 60 * 60 * 2;
const CHAT_RECORD_KEY = (responseId: string) => `chat:record:${responseId}`;
const FEEDBACK_KEY = (responseId: string) => `chat:feedback:${responseId}`;
const PRODUCT_FEEDBACK_SCORE_KEY = "chat:product-feedback-score";

const ANALYTICS_INTENT_KEY = "analytics:intent";
const ANALYTICS_AGENT_KEY = "analytics:agent";
const ANALYTICS_FEEDBACK_KEY = "analytics:feedback";
const ANALYTICS_DAILY_KEY = "analytics:daily";
const ANALYTICS_TOP_QUESTIONS_KEY = "analytics:top-questions";
const ANALYTICS_TOP_PRODUCTS_KEY = "analytics:top-products";

const supportIntentPattern = /bảo hành|giao hàng|ship|đổi trả|chính sách|support|faq/i;
const compareIntentPattern = /so sánh|compare|vs\.?|khác nhau|nên chọn.*hay/i;
const buildIntentPattern = /build\s*pc|ráp\s*pc|cấu hình.*triệu|lắp máy/i;
const recommendationIntentPattern = /gợi ý|đề xuất|nên mua|tư vấn/i;

const CATEGORY_ALIASES: Record<string, string[]> = {
  cpu: ["cpu", "vi xu ly", "processor", "intel", "amd", "ryzen", "core i"],
  gpu: ["gpu", "vga", "card", "card man hinh", "rtx", "radeon", "geforce"],
  ram: ["ram", "ddr4", "ddr5", "bo nho"],
  ssd: ["ssd", "nvme", "m2", "o cung"],
  mainboard: ["mainboard", "motherboard", "bo mach chu", "b650", "z790", "b760", "b550"],
  psu: ["psu", "nguon", "power supply", "bo nguon"],
};

const BRAND_ALIASES: Record<string, string[]> = {
  "nvidia": ["nvidia", "geforce", "rtx", "gtx"],
  "amd": ["amd", "radeon", "ryzen"],
  "intel": ["intel", "core i", "i3", "i5", "i7", "i9"],
  "asus": ["asus", "rog", "tuf"],
  "msi": ["msi", "mag", "mpg"],
  "gigabyte": ["gigabyte", "aorus"],
  "corsair": ["corsair"],
};

const CORE_CATEGORIES = ["cpu", "gpu", "ram", "ssd", "mainboard", "psu"];

function detectIntent(message: string): ChatIntent {
  if (compareIntentPattern.test(message)) return "compare";
  if (buildIntentPattern.test(message)) return "build";
  if (supportIntentPattern.test(message)) return "support";
  if (recommendationIntentPattern.test(message)) return "recommendation";
  if (/^xin chào|^chào|hello|hi\b/i.test(message)) return "greeting";
  return "general";
}

function routeAgent(intent: ChatIntent): AgentName {
  switch (intent) {
    case "compare":
      return "compare";
    case "build":
      return "build";
    case "support":
      return "support";
    default:
      return "advisor";
  }
}

function formatVND(v: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(v)} VNĐ`;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function semanticSimilarity(a: string, b: string): number {
  const ta = new Set(tokenize(a));
  const tb = new Set(tokenize(b));
  if (ta.size === 0 || tb.size === 0) return 0;

  let inter = 0;
  ta.forEach((t) => {
    if (tb.has(t)) inter += 1;
  });
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function searchProducts(query: string, limit = 12): Promise<Product[]> {
  const data = await fetchJson<any>(
    `${PRODUCT_URL}/api/products/search?q=${encodeURIComponent(query)}&limit=${limit}`
  );
  return data?.data ?? [];
}

async function fetchProductsByCategory(category: string, limit = 100): Promise<Product[]> {
  const data = await fetchJson<any>(
    `${PRODUCT_URL}/api/products?category=${encodeURIComponent(category)}&limit=${limit}`
  );
  return data?.data ?? [];
}

function uniqueProducts(products: Product[]): Product[] {
  const map = new Map<string, Product>();
  for (const p of products) {
    if (p?.id && !map.has(p.id)) map.set(p.id, p);
  }
  return Array.from(map.values());
}

async function scoreProduct(p: Product, query: string, intent?: ChatIntent): Promise<number> {
  const text = `${p.name} ${p.brand} ${p.category} ${p.shortDesc || ""}`;
  const semantic = semanticSimilarity(text, query);
  const rating = Math.max(0, Math.min(5, Number(p.rating || 0))) / 5;
  
  return 0.5 * semantic + 0.5 * rating;
}

async function searchProductsWithExpansion(query: string, limit = 20, intent?: ChatIntent): Promise<Product[]> {
  const direct = await searchProducts(query, limit);
  if (direct.length >= Math.min(6, limit)) return direct;

  const scored = await Promise.all(
    direct.map(async (p) => ({ product: p, score: await scoreProduct(p, query, intent) }))
  );
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.product);
}

async function trackAnalytics(intent: ChatIntent, agent: AgentName, question: string, productIds: string[]) {
  const day = new Date().toISOString().slice(0, 10);
  const normalizedQuestion = question.trim().toLowerCase().slice(0, 220);

  const pipeline = redis.multi();
  pipeline.hincrby(ANALYTICS_INTENT_KEY, intent, 1);
  pipeline.hincrby(ANALYTICS_AGENT_KEY, agent, 1);
  pipeline.zincrby(ANALYTICS_DAILY_KEY, 1, day);
  pipeline.zincrby(ANALYTICS_TOP_QUESTIONS_KEY, 1, normalizedQuestion);
  for (const pid of productIds) {
    pipeline.zincrby(ANALYTICS_TOP_PRODUCTS_KEY, 1, pid);
  }
  await pipeline.exec();
}

/**
 * Enrich Q&A answer với related products từ knowledge base
 */
async function enrichAnswerWithProducts(
  qa: QARecord,
  userQuery: string
): Promise<{ answer: string; products: Product[]; sources: string[] }> {
  const relatedProductIds = qa.relatedProducts || [];
  let products: Product[] = [];
  let sources: string[] = qa.tags.map((t) => `Tag: ${t}`);

  // Fetch related products nếu có
  if (relatedProductIds.length > 0) {
    // Bạn có thể implement fetch từ product service nếu cần
    // Tạm thời skip vì không có bulk fetch endpoint
  }

  // Search thêm products dựa trên tags
  if (qa.tags.length > 0) {
    const searchQuery = qa.tags.slice(0, 3).join(" ");
    const searchResults = await searchProductsWithExpansion(searchQuery, 6, qa.intent as ChatIntent);
    products = uniqueProducts([...products, ...searchResults]);
    sources = [...sources, ...searchResults.slice(0, 4).map((p) => `Product: ${p.name}`)];
  }

  // Fallback search nếu không có tag results
  if (products.length === 0) {
    const fallbackResults = await searchProductsWithExpansion(userQuery, 6, qa.intent as ChatIntent);
    products = fallbackResults;
    sources = [...sources, ...fallbackResults.slice(0, 4).map((p) => `Product: ${p.name}`)];
  }

  return {
    answer: qa.answer,
    products,
    sources: Array.from(new Set(sources)).slice(0, 12),
  };
}

async function buildLocalBuildPCAnswer(message: string): Promise<{
  answer: string;
  products: Product[];
  sources: string[];
}> {
  // Find Q&A với intent "build"
  const buildQA = QA_DATASET.find(
    (qa) =>
      qa.intent === "build" &&
      message.toLowerCase().includes("build")
  );

  if (buildQA) {
    return enrichAnswerWithProducts(buildQA, message);
  }

  // Fallback generic build answer
  const products = await searchProductsWithExpansion("build pc cpu gpu ram", 6, "build");
  return {
    answer:
      "Mình có thể giúp bạn build PC phù hợp ngân sách. Hãy cho mình biết:\n" +
      "1. 💰 Ngân sách bao nhiêu tiền?\n" +
      "2. 🎯 Dùng để làm gì? (Gaming, Work, General)\n" +
      "3. 🎮 Nhu cầu cụ thể nào? (Chơi game nào, bao nhiêu fps?)\n\n" +
      "Ví dụ: 'Build PC 12 triệu chơi Cyberpunk 2077 FHD High' → Mình sẽ gợi ý cấu hình tối ưu!",
    products,
    sources: [...products.map((p) => `Product: ${p.name}`), "FAQ: Build PC"],
  };
}

async function buildLocalCompareAnswer(message: string): Promise<{
  answer: string;
  products: Product[];
  sources: string[];
}> {
  const compareQA = QA_DATASET.find(
    (qa) =>
      qa.intent === "compare" &&
      (message.toLowerCase().includes("so sánh") || message.toLowerCase().includes("compare"))
  );

  if (compareQA) {
    return enrichAnswerWithProducts(compareQA, message);
  }

  // Generic compare answer
  const products = await searchProductsWithExpansion(message, 6, "compare");
  return {
    answer:
      "Bạn muốn so sánh 2 sản phẩm nào? Cho mình biết:\n" +
      "1. Sản phẩm A: (VD: Intel i7-14700K)\n" +
      "2. Sản phẩm B: (VD: AMD Ryzen 7 7800X3D)\n\n" +
      "Mình sẽ so sánh chi tiết về hiệu năng, giá, ưu/nhược điểm!",
    products,
    sources: ["Compare: Generic"],
  };
}

async function buildLocalSupportAnswer(message: string): Promise<{
  answer: string;
  products: Product[];
  sources: string[];
}> {
  const supportQA = QA_DATASET.find((qa) => qa.intent === "support");

  if (supportQA) {
    return enrichAnswerWithProducts(supportQA, message);
  }

  return {
    answer:
      "Mình có thể giúp bạn với các câu hỏi về:\n" +
      "- 🛡️ Bảo hành sản phẩm\n" +
      "- 🚚 Giao hàng & phí ship\n" +
      "- 🔌 Tương thích linh kiện\n" +
      "- 💰 Chính sách hoàn tiền\n" +
      "- 🔧 Kỹ thuật & tư vấn\n\n" +
      "Bạn muốn hỏi gì?",
    products: [],
    sources: ["Support: Generic"],
  };
}

export const chatService = {
  async chat(sessionId: string, message: string) {
    const intent = detectIntent(message);
    const agent = routeAgent(intent);

    // ========== TRY Q&A DATASET FIRST ==========
    const qaMatch = findBestQAMatch(message, 0.25);

    if (qaMatch) {
      logger.info(`Q&A Match found: ${qaMatch.id} (similarity score: good)`);

      const { answer, products, sources } = await enrichAnswerWithProducts(
        qaMatch,
        message
      );

      await redis.rpush(CHAT_KEY(sessionId), JSON.stringify({ role: "user", content: message }));
      await redis.rpush(CHAT_KEY(sessionId), JSON.stringify({ role: "model", content: answer }));
      await redis.expire(CHAT_KEY(sessionId), CHAT_TTL);

      const responseId = crypto.randomUUID();
      const record: ChatRecord = {
        responseId,
        sessionId,
        question: message,
        answer,
        intent,
        agent,
        products: products.map((p) => p.id),
        createdAt: new Date().toISOString(),
      };
      await redis.set(CHAT_RECORD_KEY(responseId), JSON.stringify(record), "EX", 60 * 60 * 24 * 7);
      await trackAnalytics(intent, agent, message, record.products);

      return {
        message: answer,
        sessionId,
        responseId,
        intent: qaMatch.intent,
        agent: qaMatch.agent,
        products,
        sources,
        suggestedQuestions: [
          "Bạn muốn mình giải thích chi tiết hơn không?",
          "Có thắc mắc gì khác không?",
          "Bạn muốn xem các lựa chọn khác không?",
        ],
      };
    }

    // ========== FALLBACK: Local RAG based on intent ==========
    logger.info(`No Q&A match found for intent: ${intent}. Using fallback...`);

    let fallbackResult: { answer: string; products: Product[]; sources: string[] };

    if (intent === "build") {
      fallbackResult = await buildLocalBuildPCAnswer(message);
    } else if (intent === "compare") {
      fallbackResult = await buildLocalCompareAnswer(message);
    } else if (intent === "support") {
      fallbackResult = await buildLocalSupportAnswer(message);
    } else {
      // Generic advisor
      const advisorQA = QA_DATASET.find((qa) => qa.agent === "advisor");
      if (advisorQA) {
        fallbackResult = await enrichAnswerWithProducts(advisorQA, message);
      } else {
        const products = await searchProductsWithExpansion(message, 6, intent);
        fallbackResult = {
          answer:
            "Mình là PC Advisor Bot. Tôi có thể giúp bạn với:\n" +
            "- 🎮 Build PC gaming theo ngân sách\n" +
            "- ⚙️ So sánh linh kiện\n" +
            "- 💰 Tư vấn nâng cấp\n" +
            "- 🛡️ Hỏi về bảo hành & giao hàng\n\n" +
            "Bạn muốn hỏi gì?",
          products,
          sources: ["Generic: Advisor"],
        };
      }
    }

    await redis.rpush(CHAT_KEY(sessionId), JSON.stringify({ role: "user", content: message }));
    await redis.rpush(CHAT_KEY(sessionId), JSON.stringify({ role: "model", content: fallbackResult.answer }));
    await redis.expire(CHAT_KEY(sessionId), CHAT_TTL);

    const responseId = crypto.randomUUID();
    const record: ChatRecord = {
      responseId,
      sessionId,
      question: message,
      answer: fallbackResult.answer,
      intent,
      agent,
      products: fallbackResult.products.map((p) => p.id),
      createdAt: new Date().toISOString(),
    };
    await redis.set(CHAT_RECORD_KEY(responseId), JSON.stringify(record), "EX", 60 * 60 * 24 * 7);
    await trackAnalytics(intent, agent, message, record.products);

    return {
      message: fallbackResult.answer,
      sessionId,
      responseId,
      intent,
      agent,
      products: fallbackResult.products,
      sources: fallbackResult.sources,
      suggestedQuestions: [
        "Bạn có thắc mắc gì khác không?",
        "Mình có thể giúp gì thêm?",
        "Bạn muốn tìm hiểu thêm gì?",
      ],
    };
  },

  async getHistory(sessionId: string) {
    const raw = await redis.lrange(CHAT_KEY(sessionId), 0, -1);
    return raw.map((r) => JSON.parse(r));
  },

  async clearHistory(sessionId: string) {
    return redis.del(CHAT_KEY(sessionId));
  },

  async submitFeedback(responseId: string, rating: FeedbackRating) {
    const recordRaw = await redis.get(CHAT_RECORD_KEY(responseId));
    if (!recordRaw) {
      throw new Error("Response not found");
    }

    const record = JSON.parse(recordRaw) as ChatRecord;
    await redis.set(FEEDBACK_KEY(responseId), rating, "EX", 60 * 60 * 24 * 30);

    const pipeline = redis.multi();
    pipeline.hincrby(ANALYTICS_FEEDBACK_KEY, rating, 1);

    for (const productId of record.products) {
      const increment = rating === "like" ? 1 : -1;
      pipeline.hincrby(PRODUCT_FEEDBACK_SCORE_KEY, productId, increment);
    }

    await pipeline.exec();
    return { responseId, rating, products: record.products };
  },

  async getAnalytics() {
    const [intents, agents, feedback, daily] = await Promise.all([
      redis.hgetall(ANALYTICS_INTENT_KEY),
      redis.hgetall(ANALYTICS_AGENT_KEY),
      redis.hgetall(ANALYTICS_FEEDBACK_KEY),
      redis.zrange(ANALYTICS_DAILY_KEY, 0, -1, "WITHSCORES"),
    ]);

    return {
      intents: Object.entries(intents).map(([intent, count]) => ({
        intent,
        count: Number(count),
      })),
      agents: Object.entries(agents).map(([agent, count]) => ({
        agent,
        count: Number(count),
      })),
      feedback: Object.entries(feedback).map(([rating, count]) => ({
        rating,
        count: Number(count),
      })),
      daily: daily.reduce((acc: any[], value: any, idx: number) => {
        if (idx % 2 === 0) acc.push({ date: value, count: Number(daily[idx + 1]) });
        return acc;
      }, []),
    };
  },
};

export default chatService;
