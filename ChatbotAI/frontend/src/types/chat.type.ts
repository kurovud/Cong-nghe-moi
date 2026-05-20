/* ──────────── Chat Message ──────────── */
export type MessageRole = "user" | "assistant" | "system";

export type MessageContentType =
  | "text"
  | "products"
  | "build-suggestion"
  | "assembly-guide"
  | "comparison"
  | "order-form";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  contentType: MessageContentType;
  responseId?: string;
  agent?: "advisor" | "compare" | "build" | "support";
  feedback?: "like" | "dislike";
  /** Danh sách sản phẩm đề xuất (nếu có) */
  products?: ProductCard[];
  /** Hướng dẫn lắp ráp (nếu có) */
  assemblySteps?: AssemblyStepInfo[];
  /** So sánh sản phẩm (nếu có) */
  comparison?: ComparisonData;
  sources?: string[];
  timestamp: string;
}

/* ──────────── Product Card nhúng trong chat ──────────── */
export interface ProductCard {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  image: string;
  shortDesc: string;
  rating: number;
  specs: Record<string, string>;
}

/* ──────────── Assembly Step Info ──────────── */
export interface AssemblyStepInfo {
  step: number;
  title: string;
  description: string;
  tips: string[];
  warning?: string;
}

/* ──────────── So sánh sản phẩm ──────────── */
export interface ComparisonData {
  title: string;
  products: ProductCard[];
  highlights: string[];
}

/* ──────────── Conversation ──────────── */
export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

/* ──────────── Intent routing ──────────── */
export type ChatIntent =
  | "greeting"
  | "product_inquiry"
  | "product_recommendation"
  | "price_check"
  | "comparison"
  | "compatibility_check"
  | "build_pc"
  | "assembly_guide"
  | "order"
  | "warranty"
  | "general_support"
  | "unknown";

/* ──────────── API Request / Response ──────────── */
export interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: {
    budget?: number;
    purpose?: string;
    preferences?: string[];
  };
}

export interface ChatResponse {
  answer: string;
  responseId?: string;
  agent?: "advisor" | "compare" | "build" | "support";
  contentType: MessageContentType;
  products?: ProductCard[];
  assemblySteps?: AssemblyStepInfo[];
  comparison?: ComparisonData;
  sources: string[];
  intent: ChatIntent;
  conversationId: string;
  suggestedQuestions?: string[];
}

export interface ChatFeedbackRequest {
  responseId: string;
  rating: "like" | "dislike";
}

export interface ChatAnalyticsResponse {
  totalChats: number;
  satisfactionRate: number;
  intents: Record<string, string>;
  agents: Record<string, string>;
  feedback: Record<string, string>;
  topQuestions: Array<{ key: string; value: number }>;
  topProducts: Array<{ key: string; value: number }>;
  dailyQueries: Array<{ key: string; value: number }>;
}
