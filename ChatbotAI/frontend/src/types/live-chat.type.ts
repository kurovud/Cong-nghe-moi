export type LiveChatRole = "customer" | "admin" | "system";

export type LiveChatSessionStatus = "waiting" | "active" | "closed";

export interface LiveChatMessage {
  id: string;
  sessionId: string;
  senderRole: LiveChatRole;
  senderName: string;
  content: string;
  timestamp: string;
  readByCustomer: boolean;
  readByAdmin: boolean;
}

export interface LiveChatSession {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  subject: string;
  source: string;
  status: LiveChatSessionStatus;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  unreadForAdmin: number;
  unreadForCustomer: number;
  messages: LiveChatMessage[];
}

export interface LiveChatSessionSummary {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  subject: string;
  source: string;
  status: LiveChatSessionStatus;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  unreadForAdmin: number;
  unreadForCustomer: number;
  messageCount: number;
  latestMessage?: string;
  latestSenderRole?: LiveChatRole;
}

export interface CreateLiveChatSessionRequest {
  userId?: string;
  userName: string;
  userEmail?: string;
  subject?: string;
  source?: string;
  initialMessage?: string;
}

export interface SendLiveChatMessageRequest {
  senderRole: LiveChatRole;
  senderName: string;
  content: string;
}

export interface LiveChatMessagesResponse {
  session: LiveChatSessionSummary;
  messages: LiveChatMessage[];
}

export interface LiveChatSessionsResponse {
  sessions: LiveChatSessionSummary[];
  total: number;
}