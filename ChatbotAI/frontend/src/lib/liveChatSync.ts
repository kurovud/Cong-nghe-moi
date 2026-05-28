type LiveChatSyncSource = "customer" | "admin" | "system";

export interface LiveChatSyncEvent {
  sessionId?: string;
  source: LiveChatSyncSource;
  timestamp: number;
}

const CHANNEL_NAME = "pc-builder-live-chat-sync";
const STORAGE_KEY = "pc-builder-live-chat-sync-event";

const serializeEvent = (payload: LiveChatSyncEvent) => JSON.stringify(payload);

const parseEvent = (value: string | null): LiveChatSyncEvent | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<LiveChatSyncEvent>;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      sessionId: typeof parsed.sessionId === "string" ? parsed.sessionId : undefined,
      source:
        parsed.source === "customer" || parsed.source === "admin" || parsed.source === "system"
          ? parsed.source
          : "system",
      timestamp: typeof parsed.timestamp === "number" ? parsed.timestamp : Date.now(),
    };
  } catch {
    return null;
  }
};

export const emitLiveChatSync = (payload: Omit<LiveChatSyncEvent, "timestamp">) => {
  if (typeof window === "undefined") return;

  const event: LiveChatSyncEvent = {
    ...payload,
    timestamp: Date.now(),
  };

  const serialized = serializeEvent(event);

  try {
    if (typeof window.BroadcastChannel !== "undefined") {
      const channel = new window.BroadcastChannel(CHANNEL_NAME);
      channel.postMessage(serialized);
      channel.close();
    }
  } catch {
    // BroadcastChannel is optional; storage fallback keeps cross-tab sync working.
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Ignore storage quota or privacy mode errors.
  }
};

export const subscribeLiveChatSync = (handler: (event: LiveChatSyncEvent) => void) => {
  if (typeof window === "undefined") return () => undefined;

  const onMessage = (value: string | null) => {
    const event = parseEvent(value);
    if (event) {
      handler(event);
    }
  };

  let channel: BroadcastChannel | null = null;
  if (typeof window.BroadcastChannel !== "undefined") {
    channel = new window.BroadcastChannel(CHANNEL_NAME);
    channel.addEventListener("message", (message) => {
      if (typeof message.data === "string") {
        onMessage(message.data);
      }
    });
  }

  const storageListener = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      onMessage(event.newValue);
    }
  };

  window.addEventListener("storage", storageListener);

  return () => {
    window.removeEventListener("storage", storageListener);
    if (channel) {
      channel.close();
    }
  };
};