import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "@/lib/api/logger";
import { problem } from "@/lib/api/response";

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) {
    return ratelimit;
  }

  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token || url.includes("...")) {
    return null;
  }

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(120, "1 m"),
    analytics: true,
    prefix: "helios:ratelimit",
  });

  return ratelimit;
}

export async function enforceRateLimit(
  key: string,
): Promise<RateLimitResult | null> {
  const limiter = getRatelimit();

  if (!limiter) {
    logger.warn("Rate limiting disabled: Upstash Redis not configured");
    return null;
  }

  const result = await limiter.limit(key);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

export function rateLimitKeyFromRequest(
  request: Request,
  orgId?: string,
): string {
  if (orgId) {
    return `org:${orgId}`;
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "anonymous";
  return `ip:${ip}`;
}

export function assertRateLimitAllowed(
  result: RateLimitResult | null,
): void {
  if (!result || result.success) {
    return;
  }

  throw problem({
    type: "rate-limit-exceeded",
    title: "Too many requests",
    status: 429,
    detail: "Rate limit exceeded. Please retry later.",
  });
}
