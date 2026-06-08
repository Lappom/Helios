export function getClientIdFromPath(request: Request): string {
  const segments = new URL(request.url).pathname.split("/").filter(Boolean);
  const clientsIndex = segments.indexOf("clients");

  if (clientsIndex === -1 || !segments[clientsIndex + 1]) {
    return "";
  }

  return segments[clientsIndex + 1]!;
}
