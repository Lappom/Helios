import * as Sentry from "@sentry/nextjs";

type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function log(level: LogLevel, message: string, context?: LogContext): void {
  const payload = context ? { message, ...context } : { message };

  if (level === "error") {
    console.error(payload);
    if (process.env.SENTRY_DSN) {
      Sentry.captureMessage(message, { level: "error", extra: context });
    }
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  if (level === "debug") {
    console.debug(payload);
    return;
  }

  console.info(payload);
}

export const logger = {
  debug: (message: string, context?: LogContext) =>
    log("debug", message, context),
  info: (message: string, context?: LogContext) =>
    log("info", message, context),
  warn: (message: string, context?: LogContext) =>
    log("warn", message, context),
  error: (message: string, context?: LogContext) =>
    log("error", message, context),
  captureException: (error: unknown, context?: LogContext) => {
    console.error(error, context);
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(error, { extra: context });
    }
  },
};
