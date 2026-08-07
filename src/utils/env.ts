import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  KRIXAI_ENGINE_URL: z.string().url().default("http://127.0.0.1:8000"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  if (process.env.NODE_ENV === "production") {
    // Fail startup in production if missing essential vars
    throw new Error("Invalid environment variables in production");
  }
}

export const env = parsed.success ? parsed.data : (process.env as unknown as z.infer<typeof envSchema>);

// If in production, ensure Upstash is present per user requirements
if (env.NODE_ENV === "production" && (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN)) {
  throw new Error("Production environment requires Upstash Redis to be configured (UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN)");
}
