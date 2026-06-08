export function getAssignmentIdFromPath(request: Request): string {
  const segments = new URL(request.url).pathname.split("/").filter(Boolean);
  const assignmentsIndex = segments.indexOf("assignments");

  if (assignmentsIndex === -1 || !segments[assignmentsIndex + 1]) {
    return "";
  }

  const next = segments[assignmentsIndex + 1]!;
  if (next === "schedule" || next === "sessions") {
    return "";
  }

  return next;
}

export function getAssignmentSessionIdFromPath(request: Request): string {
  const segments = new URL(request.url).pathname.split("/").filter(Boolean);
  const sessionsIndex = segments.indexOf("sessions");

  if (sessionsIndex === -1 || !segments[sessionsIndex + 1]) {
    return "";
  }

  const next = segments[sessionsIndex + 1]!;
  if (next === "schedule") {
    return "";
  }

  return next;
}
