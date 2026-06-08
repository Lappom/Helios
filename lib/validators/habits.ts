import { z } from "zod";

export const HABIT_FREQUENCIES = ["daily", "weekly"] as const;

export const HABIT_ASSIGNMENT_STATUSES = [
  "active",
  "paused",
  "completed",
] as const;

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD.");

const reminderTimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Reminder time must be HH:mm.")
  .nullable()
  .optional();

export const createHabitSchema = z.object({
  name: z.string().trim().min(1).max(200),
  emoji: z.string().trim().min(1).max(8).optional().default("✅"),
  message: z.string().trim().max(500).optional().default(""),
  frequency: z.enum(HABIT_FREQUENCIES).optional().default("daily"),
});

export const assignHabitSchema = z.object({
  clientId: z.string().min(1),
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.nullable().optional(),
  reminderTime: reminderTimeSchema,
});

export const logHabitSchema = z.object({
  assignmentId: z.string().min(1),
  logDate: dateStringSchema.optional(),
  completed: z.boolean(),
});

export const habitStatsQuerySchema = z.object({
  start: dateStringSchema.optional(),
  end: dateStringSchema.optional(),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type AssignHabitInput = z.infer<typeof assignHabitSchema>;
export type LogHabitInput = z.infer<typeof logHabitSchema>;
export type HabitStatsQueryInput = z.infer<typeof habitStatsQuerySchema>;

export function parseHabitStatsQuery(
  searchParams: URLSearchParams,
): HabitStatsQueryInput {
  const end = searchParams.get("end") ?? undefined;
  const start = searchParams.get("start") ?? undefined;

  return habitStatsQuerySchema.parse({ start, end });
}

export function parseListHabitsQuery(searchParams: URLSearchParams) {
  return {
    search: searchParams.get("search")?.trim() || undefined,
    predefinedOnly:
      searchParams.get("predefinedOnly") === "true" ? true : undefined,
  };
}
