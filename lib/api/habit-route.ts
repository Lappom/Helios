export function getHabitIdFromPath(request: Request): string {
  const segments = new URL(request.url).pathname.split("/").filter(Boolean);
  const habitsIndex = segments.indexOf("habits");

  if (habitsIndex === -1 || !segments[habitsIndex + 1]) {
    return "";
  }

  const next = segments[habitsIndex + 1]!;
  if (next === "logs" || next === "weekly-summary") {
    return "";
  }

  return next;
}
