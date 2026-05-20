import { createRedisClient, env } from "@chatbot/common";

const redis = createRedisClient(env.REDIS_URL);

export const tokenService = {
  async blacklistToken(token: string, ttlSeconds: number) {
    await redis.set(`bl:${token}`, "1", "EX", ttlSeconds);
  },

  async isBlacklisted(token: string): Promise<boolean> {
    const val = await redis.get(`bl:${token}`);
    return val === "1";
  },
};