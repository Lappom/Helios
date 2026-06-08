export function getExerciseIdFromPath(request: Request): string {
  const segments = new URL(request.url).pathname.split("/").filter(Boolean);
  const exercisesIndex = segments.indexOf("exercises");

  if (exercisesIndex === -1 || !segments[exercisesIndex + 1]) {
    return "";
  }

  return segments[exercisesIndex + 1]!;
}
