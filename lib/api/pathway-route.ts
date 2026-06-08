export function getPathwayIdFromPath(request: Request): string {
  const segments = new URL(request.url).pathname.split("/").filter(Boolean);
  const index = segments.indexOf("pathways");

  if (index === -1 || !segments[index + 1]) {
    return "";
  }

  return segments[index + 1]!;
}
