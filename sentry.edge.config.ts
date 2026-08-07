import * as Sentry from "@sentry/nextjs";
import { env } from "./src/utils/env";

const SENTRY_DSN = env.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || env.NODE_ENV,
    release: process.env.SENTRY_RELEASE,
    
    tracesSampleRate: env.NODE_ENV === "production" ? 0.05 : 1.0,
    sendDefaultPii: false,

    beforeSend(event) {
      if (event.request) {
        if (event.request.headers) {
          delete event.request.headers["authorization"];
          delete event.request.headers["cookie"];
          delete event.request.headers["x-api-key"];
          delete event.request.headers["x-razorpay-signature"];
        }
        if (event.request.data) {
          delete event.request.data;
        }
      }
      return event;
    },
  });
}
