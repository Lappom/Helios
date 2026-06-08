import {
  boolean,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "../id";
import { clients } from "./clients";
import {
  habitAssignmentStatusEnum,
  habitFrequencyEnum,
} from "./enums";
import { organizations } from "./organization";

export const habits = pgTable(
  "habits",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    coachClerkUserId: text("coach_clerk_user_id"),
    name: text("name").notNull(),
    emoji: text("emoji").notNull().default("✅"),
    message: text("message").notNull().default(""),
    frequency: habitFrequencyEnum("frequency").notNull().default("daily"),
    isPredefined: boolean("is_predefined").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("habits_org_idx").on(t.organizationId),
    index("habits_org_predefined_idx").on(t.organizationId, t.isPredefined),
  ],
);

export const habitAssignments = pgTable(
  "habit_assignments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    habitId: text("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    reminderTime: text("reminder_time"),
    status: habitAssignmentStatusEnum("status").notNull().default("active"),
    assignedByClerkUserId: text("assigned_by_clerk_user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("habit_assignments_org_client_idx").on(
      t.organizationId,
      t.clientId,
      t.status,
    ),
    index("habit_assignments_org_habit_idx").on(t.organizationId, t.habitId),
    index("habit_assignments_reminder_idx").on(t.reminderTime, t.status),
  ],
);

export const habitLogs = pgTable(
  "habit_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    assignmentId: text("assignment_id")
      .notNull()
      .references(() => habitAssignments.id, { onDelete: "cascade" }),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    logDate: date("log_date").notNull(),
    completed: boolean("completed").notNull().default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("habit_logs_assignment_date_unique_idx").on(
      t.assignmentId,
      t.logDate,
    ),
    index("habit_logs_org_client_date_idx").on(
      t.organizationId,
      t.clientId,
      t.logDate,
    ),
    index("habit_logs_assignment_idx").on(t.assignmentId),
  ],
);
