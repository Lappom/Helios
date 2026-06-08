import { parseDayKey } from "@/lib/programs/calendar-utils";

export function normalizeScheduledDate(dateKey: string): Date {
  const date = parseDayKey(dateKey);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function toScheduledDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function parseLoadValue(load: string | null | undefined): number | null {
  if (!load) {
    return null;
  }

  const match = load.replace(",", ".").match(/(\d+(?:\.\d+)?)/);
  if (!match) {
    return null;
  }

  const value = Number.parseFloat(match[1]!);
  return Number.isFinite(value) ? value : null;
}

export function parseRepsValue(reps: string | null | undefined): number | null {
  if (!reps) {
    return null;
  }

  const match = reps.match(/(\d+)/);
  if (!match) {
    return null;
  }

  const value = Number.parseInt(match[1]!, 10);
  return Number.isFinite(value) ? value : null;
}

export function computeSetVolume(
  load: string | null | undefined,
  reps: string | null | undefined,
): number {
  const loadValue = parseLoadValue(load);
  const repsValue = parseRepsValue(reps);

  if (loadValue !== null && repsValue !== null) {
    return loadValue * repsValue;
  }

  return repsValue ?? 0;
}
