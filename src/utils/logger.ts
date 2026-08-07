import pino from "pino";
import { env } from "./env";

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  transport: env.NODE_ENV !== "production" ? {
    target: "pino-pretty",
    options: { colorize: true }
  } : undefined,
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "prompt",
    "text",
    "password",
    "token",
    "res.data.sanitized_prompt"
  ]
});
