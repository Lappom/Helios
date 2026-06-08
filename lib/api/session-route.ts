export function getProgramSessionIdFromPath(request: Request): string {
  const segments = new URL(request.url).pathname.split("/").filter(Boolean);
  const sessionsIndex = segments.indexOf("sessions");

  if (sessionsIndex === -1 || !segments[sessionsIndex + 1]) {
    return "";
  }

  return segments[sessionsIndex + 1]!;
}
