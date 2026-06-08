import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { habitAssignments, habitLogs } from "@/lib/db/schema";
import { utcToday } from "./stats";

export type HabitReminderPayload = {
  eventType: "habit_reminder";
  organizationId: string;
  clientId: string;
  assignmentId: string;
  habitName: string;
  reminderTime: string;
};

export async function enqueueNotification(
  payload: HabitReminderPayload,
): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    console.info("[habits] notification stub", payload);
  }
}

export async function processHabitReminders(now: Date = new Date()): Promise<{
  processed: number;
  skipped: number;
}> {
  const hour = String(now.getUTCHours()).padStart(2, "0");
  const minute = String(now.getUTCMinutes()).padStart(2, "0");
  const currentTime = `${hour}:${minute}`;
  const today = utcToday();

  const assignments = await db.query.habitAssignments.findMany({
    where: and(
      eq(habitAssignments.status, "active"),
      eq(habitAssignments.reminderTime, currentTime),
    ),
    with: {
      habit: true,
      logs: {
        where: and(
          eq(habitLogs.logDate, today),
          eq(habitLogs.completed, true),
        ),
        columns: { id: true },
      },
    },
  });

  let processed = 0;
  let skipped = 0;

  for (const assignment of assignments) {
    if (assignment.logs.length > 0) {
      skipped += 1;
      continue;
    }

    if (assignment.startDate > today) {
      skipped += 1;
      continue;
    }

    if (assignment.endDate && assignment.endDate < today) {
      skipped += 1;
      continue;
    }

    await enqueueNotification({
      eventType: "habit_reminder",
      organizationId: assignment.organizationId,
      clientId: assignment.clientId,
      assignmentId: assignment.id,
      habitName: assignment.habit.name,
      reminderTime: assignment.reminderTime ?? currentTime,
    });
    processed += 1;
  }

  return { processed, skipped };
}
