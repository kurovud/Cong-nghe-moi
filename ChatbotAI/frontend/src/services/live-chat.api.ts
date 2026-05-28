import type {
  CreateLiveChatSessionRequest,
  LiveChatMessagesResponse,
  LiveChatSessionsResponse,
  SendLiveChatMessageRequest,
} from "@/types/live-chat.type";

const API_BASE = "/api/live-chat";

const jsonHeaders = {
  "Content-Type": "application/json",
};

const parseJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.error || `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const createLiveChatSession = async (
  body: CreateLiveChatSessionRequest
): Promise<LiveChatMessagesResponse> => {
  const response = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return parseJson<LiveChatMessagesResponse>(response);
};

export const fetchLiveChatSessions = async (params?: {
  status?: string;
  userId?: string;
}): Promise<LiveChatSessionsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.userId) searchParams.set("userId", params.userId);
  const suffix = searchParams.toString();
  const response = await fetch(`${API_BASE}/sessions${suffix ? `?${suffix}` : ""}`);
  return parseJson<LiveChatSessionsResponse>(response);
};

export const fetchLiveChatMessages = async (
  sessionId: string,
  role?: "customer" | "admin"
): Promise<LiveChatMessagesResponse> => {
  const searchParams = new URLSearchParams();
  if (role) searchParams.set("role", role);
  const suffix = searchParams.toString();
  const response = await fetch(
    `${API_BASE}/sessions/${sessionId}/messages${suffix ? `?${suffix}` : ""}`
  );
  return parseJson<LiveChatMessagesResponse>(response);
};

export const sendLiveChatMessage = async (
  sessionId: string,
  body: SendLiveChatMessageRequest
): Promise<LiveChatMessagesResponse> => {
  const response = await fetch(`${API_BASE}/sessions/${sessionId}/messages`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return parseJson<LiveChatMessagesResponse>(response);
};

export const updateLiveChatSession = async (
  sessionId: string,
  body: { action: "close" | "reopen" | "update"; subject?: string; status?: string; userName?: string; userEmail?: string }
): Promise<LiveChatMessagesResponse["session"]> => {
  const response = await fetch(`${API_BASE}/sessions/${sessionId}`, {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return parseJson<LiveChatMessagesResponse["session"]>(response);
};