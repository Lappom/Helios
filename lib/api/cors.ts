const DEFAULT_ORIGINS = [
  "http://localhost:3000",
  "https://helios.lappom.fr",
  "https://find.helios.lappom.fr",
];

export function getAllowedOrigins(): string[] {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && !DEFAULT_ORIGINS.includes(appUrl)) {
    return [...DEFAULT_ORIGINS, appUrl];
  }
  return DEFAULT_ORIGINS;
}

export function applyCorsHeaders(
  request: Request,
  responseHeaders?: HeadersInit,
): Headers {
  const headers = new Headers(responseHeaders);
  const origin = request.headers.get("Origin");
  const allowedOrigins = getAllowedOrigins();

  if (origin && allowedOrigins.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }

  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Idempotency-Key",
  );
  headers.set("Access-Control-Expose-Headers", "X-Total-Count, Retry-After");

  return headers;
}

export function corsPreflightResponse(request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: applyCorsHeaders(request),
  });
}
