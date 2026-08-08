import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from './utils/env';

// In-memory fallback for local development only
const fallbackCache = new Map();
const fallbackRedis = {
  sadd: async () => 1,
  eval: async () => [1, 1],
  get: async () => null,
  set: async () => "OK",
} as unknown as Redis;

// If in production and Redis is missing, we will catch it during execution and fail closed
const redis = (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) 
  ? new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN })
  : fallbackRedis;

const coarseLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(200, '1 m'), // Coarse IP protection (200 req/min)
  ephemeralCache: fallbackCache,
});

import { checkRateLimit } from './utils/rate-limit';

export async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  
  // Auth rate limiting (5 req/min)
  if (request.nextUrl.pathname.startsWith('/auth')) {
    const rateLimitResponse = await checkRateLimit('auth', `auth:${ip}`);
    if (rateLimitResponse) return rateLimitResponse;
  }
  
  // Enforce 1MB payload limit
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > 1 * 1024 * 1024) {
    return new NextResponse(JSON.stringify({ error: 'Payload Too Large' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Enforce fail-closed for rate limiting in production
  if (env.NODE_ENV === 'production' && !env.UPSTASH_REDIS_REST_URL) {
    return new NextResponse(JSON.stringify({ error: 'Service Unavailable - Rate limit provider missing' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Coarse rate limiting
  try {
    const { success, limit, reset, remaining } = await coarseLimiter.limit(`ratelimit_coarse_${ip}`);
    if (!success) {
      return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (err) {
    // Fail closed if Redis throws an error in production
    if (env.NODE_ENV === 'production') {
      return new NextResponse(JSON.stringify({ error: 'Service Unavailable' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const response = await updateSession(request);
  
  // Add correlation ID
  const correlationId = crypto.randomUUID();
  response.headers.set('x-correlation-id', correlationId);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
