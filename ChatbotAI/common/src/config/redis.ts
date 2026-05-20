import Redis from "ioredis";
import { logger } from "./logger";

export function createRedisClient(url?: string): Redis {
  const redisUrl = url || process.env.REDIS_URL || "redis://localhost:6379";
  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
  });
  client.on("connect", () => logger.info("Redis connected"));
  client.on("error", (err) => logger.error("Redis error:", err));
  return client;
}
