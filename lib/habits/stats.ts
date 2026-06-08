import type { HabitFrequency } from "./types";

export function utcToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function enumerateDates(start: string, end: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${start}T00:00:00.000Z`);
  const endDate = new Date(`${end}T00:00:00.000Z`);

  while (cursor <= endDate) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

export function addDaysToDate(dateStr: string, days: number): string {
  const cursor = new Date(`${dateStr}T00:00:00.000Z`);
  cursor.setUTCDate(cursor.getUTCDate() + days);
  return cursor.toISOString().slice(0, 10);
}

export function getWeekStartMonday(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00.000Z`);
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setUTCDate(date.getUTCDate() + diff);
  return date.toISOString().slice(0, 10);
}

export function enumerateWeeks(start: string, end: string): string[] {
  const weeks: string[] = [];
  let cursor = getWeekStartMonday(start);
  const endDate = new Date(`${end}T00:00:00.000Z`);

  while (new Date(`${cursor}T00:00:00.000Z`) <= endDate) {
    weeks.push(cursor);
    cursor = addDaysToDate(cursor, 7);
  }

  return weeks;
}

type LogEntry = {
  logDate: string;
  completed: boolean;
};

type AssignmentWindow = {
  startDate: string;
  endDate: string | null;
  frequency: HabitFrequency;
};

function isDateInAssignment(date: string, assignment: AssignmentWindow): boolean {
  if (date < assignment.startDate) {
    return false;
  }
  if (assignment.endDate && date > assignment.endDate) {
    return false;
  }
  return true;
}

function logsByDate(logs: LogEntry[]): Map<string, boolean> {
  const map = new Map<string, boolean>();
  for (const log of logs) {
    map.set(log.logDate, log.completed);
  }
  return map;
}

function isPeriodCompleted(
  frequency: HabitFrequency,
  periodKey: string,
  logsMap: Map<string, boolean>,
): boolean {
  if (frequency === "daily") {
    return logsMap.get(periodKey) === true;
  }

  const weekEnd = addDaysToDate(periodKey, 6);
  const weekDates = enumerateDates(periodKey, weekEnd);
  return weekDates.some((date) => logsMap.get(date) === true);
}

export function computeCurrentStreak(
  assignment: AssignmentWindow,
  logs: LogEntry[],
  today: string = utcToday(),
): number {
  const logsMap = logsByDate(logs);
  let streak = 0;

  if (assignment.frequency === "daily") {
    let cursor = today;
    while (isDateInAssignment(cursor, assignment)) {
      if (logsMap.get(cursor) === true) {
        streak += 1;
        cursor = addDaysToDate(cursor, -1);
      } else if (cursor === today) {
        cursor = addDaysToDate(cursor, -1);
      } else {
        break;
      }
    }
    return streak;
  }

  let weekStart = getWeekStartMonday(today);
  while (isDateInAssignment(weekStart, assignment)) {
    if (isPeriodCompleted("weekly", weekStart, logsMap)) {
      streak += 1;
      weekStart = addDaysToDate(weekStart, -7);
    } else if (weekStart === getWeekStartMonday(today)) {
      weekStart = addDaysToDate(weekStart, -7);
    } else {
      break;
    }
  }

  return streak;
}

export function computeLongestStreak(
  assignment: AssignmentWindow,
  logs: LogEntry[],
  windowStart: string,
  windowEnd: string,
): number {
  const logsMap = logsByDate(logs);
  let longest = 0;
  let current = 0;

  if (assignment.frequency === "daily") {
    const dates = enumerateDates(windowStart, windowEnd).filter((date) =>
      isDateInAssignment(date, assignment),
    );

    for (const date of dates) {
      if (logsMap.get(date) === true) {
        current += 1;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }

    return longest;
  }

  const weeks = enumerateWeeks(windowStart, windowEnd).filter((weekStart) =>
    isDateInAssignment(weekStart, assignment),
  );

  for (const weekStart of weeks) {
    if (isPeriodCompleted("weekly", weekStart, logsMap)) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

export function computeCompletionRate(
  assignment: AssignmentWindow,
  logs: LogEntry[],
  windowStart: string,
  windowEnd: string,
): number {
  const logsMap = logsByDate(logs);
  let expected = 0;
  let completed = 0;

  if (assignment.frequency === "daily") {
    for (const date of enumerateDates(windowStart, windowEnd)) {
      if (!isDateInAssignment(date, assignment)) {
        continue;
      }
      expected += 1;
      if (logsMap.get(date) === true) {
        completed += 1;
      }
    }
  } else {
    for (const weekStart of enumerateWeeks(windowStart, windowEnd)) {
      if (!isDateInAssignment(weekStart, assignment)) {
        continue;
      }
      expected += 1;
      if (isPeriodCompleted("weekly", weekStart, logsMap)) {
        completed += 1;
      }
    }
  }

  if (expected === 0) {
    return 0;
  }

  return Math.round((completed / expected) * 100);
}

export function computeWeeklyBreakdown(
  assignments: AssignmentWindow[],
  logsByAssignment: Map<string, LogEntry[]>,
  endDate: string = utcToday(),
): Array<{
  date: string;
  completionRate: number;
  completedCount: number;
  expectedCount: number;
}> {
  const startDate = addDaysToDate(endDate, -6);
  const dates = enumerateDates(startDate, endDate);

  return dates.map((date) => {
    let expectedCount = 0;
    let completedCount = 0;

    for (const [index, assignment] of assignments.entries()) {
      if (!isDateInAssignment(date, assignment)) {
        continue;
      }

      if (assignment.frequency === "weekly") {
        const weekStart = getWeekStartMonday(date);
        if (date !== weekStart) {
          continue;
        }
      }

      expectedCount += 1;
      const logs = logsByAssignment.get(String(index)) ?? [];
      const logsMap = logsByDate(logs);

      if (assignment.frequency === "daily") {
        if (logsMap.get(date) === true) {
          completedCount += 1;
        }
      } else if (isPeriodCompleted("weekly", getWeekStartMonday(date), logsMap)) {
        completedCount += 1;
      }
    }

    return {
      date,
      expectedCount,
      completedCount,
      completionRate:
        expectedCount === 0
          ? 0
          : Math.round((completedCount / expectedCount) * 100),
    };
  });
}

export function resolveStatsWindow(input?: {
  start?: string;
  end?: string;
}): { start: string; end: string } {
  const end = input?.end ?? utcToday();
  const start = input?.start ?? addDaysToDate(end, -29);
  return { start, end };
}
