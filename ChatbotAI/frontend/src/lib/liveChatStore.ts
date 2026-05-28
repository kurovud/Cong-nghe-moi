import { addNotification } from "@/lib/notificationStore";
import type {
  CreateLiveChatSessionRequest,
  LiveChatMessage,
  LiveChatRole,
  LiveChatSession,
  LiveChatSessionStatus,
  LiveChatSessionSummary,
  SendLiveChatMessageRequest,
} from "@/types/live-chat.type";

interface LiveChatStore {
  sessions: LiveChatSession[];
}

const getStore = (): LiveChatStore => {
  const g = globalThis as unknown as { __liveChatStore?: LiveChatStore };
  if (!g.__liveChatStore) {
    g.__liveChatStore = { sessions: [] };
  }
  return g.__liveChatStore;
};

const makeId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const normalizeText = (value: string) => value.trim().replace(/\s+/g, " ");

const toSummary = (session: LiveChatSession): LiveChatSessionSummary => {
  const latest = session.messages[0];
  return {
    id: session.id,
    userId: session.userId,
    userName: session.userName,
    userEmail: session.userEmail,
    subject: session.subject,
    source: session.source,
    status: session.status,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    lastMessageAt: session.lastMessageAt,
    unreadForAdmin: session.unreadForAdmin,
    unreadForCustomer: session.unreadForCustomer,
    messageCount: session.messages.length,
    latestMessage: latest?.content,
    latestSenderRole: latest?.senderRole,
  };
};

const getSessionOrThrow = (sessionId: string) => {
  const session = getStore().sessions.find((item) => item.id === sessionId);
  if (!session) {
    throw new Error("Không tìm thấy phiên chat");
  }
  return session;
};

const appendMessage = (
  session: LiveChatSession,
  payload: SendLiveChatMessageRequest
): LiveChatMessage => {
  const now = new Date().toISOString();
  const content = normalizeText(payload.content);
  if (!content) {
    throw new Error("Nội dung tin nhắn không được để trống");
  }

  const message: LiveChatMessage = {
    id: makeId("msg"),
    sessionId: session.id,
    senderRole: payload.senderRole,
    senderName: normalizeText(payload.senderName || "Khách hàng"),
    content,
    timestamp: now,
    readByCustomer: payload.senderRole === "customer",
    readByAdmin: payload.senderRole === "admin",
  };

  session.messages.unshift(message);
  session.updatedAt = now;
  session.lastMessageAt = now;

  if (payload.senderRole === "customer") {
    session.status = session.status === "closed" ? "waiting" : session.status === "active" ? session.status : "waiting";
    session.unreadForAdmin += 1;
    session.unreadForCustomer = 0;
    addNotification("admin", {
      type: "system",
      title: "Có tin nhắn hỗ trợ mới",
      message: `${session.userName}: ${content.slice(0, 80)}${content.length > 80 ? "…" : ""}`,
      link: "/admin/live-chats",
    });
  } else if (payload.senderRole === "admin") {
    session.status = "active";
    session.unreadForCustomer += 1;
    session.unreadForAdmin = 0;
    if (session.userId) {
      addNotification(session.userId, {
        type: "system",
        title: "Nhân viên đã phản hồi",
        message: content.slice(0, 80) + (content.length > 80 ? "…" : ""),
        link: "/",
      });
    }
  }

  return message;
};

export const createLiveChatSession = (input: CreateLiveChatSessionRequest) => {
  const now = new Date().toISOString();
  const session: LiveChatSession = {
    id: makeId("chat"),
    userId: normalizeText(input.userId || "guest") || "guest",
    userName: normalizeText(input.userName || "Khách hàng"),
    userEmail: input.userEmail?.trim() || undefined,
    subject: normalizeText(input.subject || "Hỗ trợ trực tiếp"),
    source: normalizeText(input.source || "floating-widget"),
    status: "waiting",
    createdAt: now,
    updatedAt: now,
    lastMessageAt: now,
    unreadForAdmin: 0,
    unreadForCustomer: 0,
    messages: [],
  };

  const store = getStore();
  store.sessions.unshift(session);

  let initialMessage: LiveChatMessage | undefined;
  if (input.initialMessage?.trim()) {
    initialMessage = appendMessage(session, {
      senderRole: "customer",
      senderName: session.userName,
      content: input.initialMessage,
    });
  }

  return {
    session: toSummary(session),
    message: initialMessage,
    messages: session.messages.slice().reverse(),
  };
};

export const listLiveChatSessions = (filter?: {
  status?: LiveChatSessionStatus;
  userId?: string;
}): LiveChatSessionSummary[] => {
  const store = getStore();
  return store.sessions
    .filter((session) => {
      if (filter?.status && session.status !== filter.status) return false;
      if (filter?.userId && session.userId !== filter.userId) return false;
      return true;
    })
    .map(toSummary)
    .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
};

export const getLiveChatSessionSummary = (
  sessionId: string
): LiveChatSessionSummary => toSummary(getSessionOrThrow(sessionId));

export const getLiveChatMessages = (sessionId: string): LiveChatMessage[] =>
  getSessionOrThrow(sessionId).messages.slice().reverse();

export const addLiveChatMessage = (
  sessionId: string,
  payload: SendLiveChatMessageRequest
) => {
  const session = getSessionOrThrow(sessionId);
  const message = appendMessage(session, payload);
  return {
    session: toSummary(session),
    message,
    messages: session.messages.slice().reverse(),
  };
};

export const markLiveChatMessagesRead = (
  sessionId: string,
  role: LiveChatRole
) => {
  const session = getSessionOrThrow(sessionId);
  session.messages.forEach((message) => {
    if (role === "admin") {
      message.readByAdmin = true;
    }
    if (role === "customer") {
      message.readByCustomer = true;
    }
  });
  if (role === "admin") session.unreadForAdmin = 0;
  if (role === "customer") session.unreadForCustomer = 0;
  session.updatedAt = new Date().toISOString();
  return toSummary(session);
};

export const closeLiveChatSession = (sessionId: string) => {
  const session = getSessionOrThrow(sessionId);
  session.status = "closed";
  session.updatedAt = new Date().toISOString();
  return toSummary(session);
};

export const reopenLiveChatSession = (sessionId: string) => {
  const session = getSessionOrThrow(sessionId);
  session.status = "waiting";
  session.updatedAt = new Date().toISOString();
  return toSummary(session);
};

export const updateLiveChatSession = (
  sessionId: string,
  changes: Partial<Pick<LiveChatSession, "subject" | "status" | "userName" | "userEmail">>
) => {
  const session = getSessionOrThrow(sessionId);
  if (changes.subject !== undefined) session.subject = normalizeText(changes.subject || session.subject);
  if (changes.status !== undefined) session.status = changes.status;
  if (changes.userName !== undefined) session.userName = normalizeText(changes.userName || session.userName);
  if (changes.userEmail !== undefined) session.userEmail = changes.userEmail?.trim() || undefined;
  session.updatedAt = new Date().toISOString();
  return toSummary(session);
};

export const getLiveChatStats = () => {
  const sessions = getStore().sessions;
  return {
    totalSessions: sessions.length,
    activeSessions: sessions.filter((session) => session.status === "active").length,
    waitingSessions: sessions.filter((session) => session.status === "waiting").length,
    closedSessions: sessions.filter((session) => session.status === "closed").length,
    unreadForAdmin: sessions.reduce((sum, session) => sum + session.unreadForAdmin, 0),
    unreadForCustomer: sessions.reduce((sum, session) => sum + session.unreadForCustomer, 0),
  };
};