export function getServiceIdFromPath(request: Request): string {
  const pathname = new URL(request.url).pathname;
  const segments = pathname.split("/").filter(Boolean);
  const servicesIndex = segments.indexOf("services");
  return servicesIndex >= 0 ? (segments[servicesIndex + 1] ?? "") : "";
}

export function getPublicCoachSlugFromPath(request: Request): string {
  const pathname = new URL(request.url).pathname;
  const segments = pathname.split("/").filter(Boolean);
  const coachesIndex = segments.indexOf("coaches");
  return coachesIndex >= 0 ? (segments[coachesIndex + 1] ?? "") : "";
}
