import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from './env';
import { NextResponse } from 'next/server';

const fallbackCache = new Map();
const fallbackRedis = {
  sadd: async () => 1,
  eval: async () => [1, 1],
  get: async () => null,
  set: async () => "OK",
} as unknown as Redis;

export const redis = (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) 
  ? new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN })
  : fallbackRedis;

// Pre-configured limiters
const limiters = {
  auth: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 m'), ephemeralCache: fallbackCache }),
  keys: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 m'), ephemeralCache: fallbackCache }),
  order: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 m'), ephemeralCache: fallbackCache }),
  webhook: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, '1 m'), ephemeralCache: fallbackCache }),
  scan: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 m'), ephemeralCache: fallbackCache }),
};

export async function checkRateLimit(type: keyof typeof limiters, identifier: string) {
  if (env.NODE_ENV === 'production' && !env.UPSTASH_REDIS_REST_URL) {
    throw new Error('Service Unavailable - Rate limit provider missing');
  }

  try {
    const { success, limit, reset, remaining } = await limiters[type].limit(identifier);
    if (!success) {
      return NextResponse.json({ error: 'Too Many Requests' }, {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      });
    }
  } catch (error) {
    if (env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Service Unavailable' }, { status: 503 });
    }
  }
  return null;
}
