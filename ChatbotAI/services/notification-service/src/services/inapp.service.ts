import { createRedisClient, env } from "@chatbot/common";

const redis = createRedisClient(env.REDIS_URL);

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

const NOTI_KEY = (userId: string) => `notifications:${userId}`;
const MAX_NOTIFICATIONS = 100;

export const inAppService = {
  async create(userId: string, notification: Omit<Notification, "id" | "read" | "createdAt">) {
    const noti: Notification = {
      ...notification,
      id: `n_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };

    await redis.lpush(NOTI_KEY(userId), JSON.stringify(noti));
    await redis.ltrim(NOTI_KEY(userId), 0, MAX_NOTIFICATIONS - 1);

    return noti;
  },

  async getAll(userId: string, limit = 50): Promise<Notification[]> {
    const items = await redis.lrange(NOTI_KEY(userId), 0, limit - 1);
    return items.map((item) => JSON.parse(item));
  },

  async markAsRead(userId: string, notificationId: string) {
    const items = await redis.lrange(NOTI_KEY(userId), 0, -1);
    const updated = items.map((item) => {
      const parsed = JSON.parse(item);
      if (parsed.id === notificationId) parsed.read = true;
      return JSON.stringify(parsed);
    });

    const pipeline = redis.multi();
    pipeline.del(NOTI_KEY(userId));
    for (const item of updated) {
      pipeline.rpush(NOTI_KEY(userId), item);
    }
    await pipeline.exec();
  },

  async markAllAsRead(userId: string) {
    const items = await redis.lrange(NOTI_KEY(userId), 0, -1);
    const updated = items.map((item) => {
      const parsed = JSON.parse(item);
      parsed.read = true;
      return JSON.stringify(parsed);
    });

    const pipeline = redis.multi();
    pipeline.del(NOTI_KEY(userId));
    for (const item of updated) {
      pipeline.rpush(NOTI_KEY(userId), item);
    }
    await pipeline.exec();
  },

  async getUnreadCount(userId: string): Promise<number> {
    const items = await redis.lrange(NOTI_KEY(userId), 0, -1);
    return items.filter((item) => !JSON.parse(item).read).length;
  },

  async clear(userId: string) {
    await redis.del(NOTI_KEY(userId));
  },
};