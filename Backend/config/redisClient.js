import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasUpstashConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

let redis = null;

if (hasUpstashConfig) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  console.log("🚀 Upstash Redis client initialized via serverless REST API.");
} else {
  console.warn("⚠️ Upstash Redis credentials missing in .env. Using in-memory fallback cache.");
}

// for development environment if redis client is not configured due to any error then we use inbuilt js map data structure
const inMemoryStore = new Map();
const memoryTimeouts = new Map();

const fallbackClient = {
  set: async (key, value, expirySeconds) => {
    inMemoryStore.set(key, value);
    if (memoryTimeouts.has(key)) {
      clearTimeout(memoryTimeouts.get(key));
    }
    if (expirySeconds) {
      const timeoutId = setTimeout(() => {
        inMemoryStore.delete(key);
        memoryTimeouts.delete(key);
      }, expirySeconds * 1000);
      memoryTimeouts.set(key, timeoutId);
    }
    return "OK";
  },
  get: async (key) => {
    return inMemoryStore.get(key) || null;
  },
  del: async (key) => {
    if (memoryTimeouts.has(key)) {
      clearTimeout(memoryTimeouts.get(key));
      memoryTimeouts.delete(key);
    }
    return inMemoryStore.delete(key);
  }
};

// ----------------------------------------------------
// Unified Cache Service Interface
// ----------------------------------------------------
export const cacheService = {
  set: async (key, value, expirySeconds) => {
    if (redis) {
      try {
        if (expirySeconds) {
          await redis.set(key, value, { ex: expirySeconds });
        } else {
          await redis.set(key, value);
        }
        return "OK";
      } catch (err) {
        console.error("🔴 Upstash Redis SET error:", err.message);
      }
    }
    return fallbackClient.set(key, value, expirySeconds);
  },

  get: async (key) => {
    if (redis) {
      try {
        const val = await redis.get(key);
        return val;
      } catch (err) {
        console.error("🔴 Upstash Redis GET error:", err.message);
      }
    }
    return fallbackClient.get(key);
  },

  del: async (key) => {
    if (redis) {
      try {
        await redis.del(key);
        return true;
      } catch (err) {
        console.error("🔴 Upstash Redis DEL error:", err.message);
      }
    }
    return fallbackClient.del(key);
  },
};

export const ratelimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m")
}) : {
  limit: async () => ({
    success: true
  })
}