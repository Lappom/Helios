export function getNotificationTemplateIdFromPath(
  request: Request,
): string | null {
  const pathname = new URL(request.url).pathname;
  const segments = pathname.split("/").filter(Boolean);
  const templatesIndex = segments.indexOf("templates");
  if (templatesIndex === -1) {
    return null;
  }
  return segments[templatesIndex + 1] ?? null;
}
