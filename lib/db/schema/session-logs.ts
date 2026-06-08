import {
  boolean,
  index,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "../id";
import { clients } from "./clients";
import { sessionLogStatusEnum } from "./enums";
import { organizations } from "./organization";
import {
  blockExercises,
  programAssignments,
  programSessions,
  setPrescriptions,
} from "./programs";
import { exercises } from "./exercises";

export const sessionLogs = pgTable(
  "session_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    assignmentId: text("assignment_id")
      .notNull()
      .references(() => programAssignments.id, { onDelete: "cascade" }),
    programSessionId: text("program_session_id")
      .notNull()
      .references(() => programSessions.id, { onDelete: "cascade" }),
    scheduledDate: timestamp("scheduled_date", { withTimezone: true }).notNull(),
    status: sessionLogStatusEnum("status").notNull().default("in_progress"),
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
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
    uniqueIndex("session_logs_assignment_session_date_unique_idx").on(
      t.assignmentId,
      t.programSessionId,
      t.scheduledDate,
    ),
    index("session_logs_org_client_status_idx").on(
      t.organizationId,
      t.clientId,
      t.status,
    ),
    index("session_logs_assignment_idx").on(t.assignmentId),
  ],
);

export const setLogs = pgTable(
  "set_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    sessionLogId: text("session_log_id")
      .notNull()
      .references(() => sessionLogs.id, { onDelete: "cascade" }),
    blockExerciseId: text("block_exercise_id")
      .notNull()
      .references(() => blockExercises.id, { onDelete: "cascade" }),
    setPrescriptionId: text("set_prescription_id").references(
      () => setPrescriptions.id,
      { onDelete: "set null" },
    ),
    setNumber: integer("set_number").notNull(),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "restrict" }),
    load: text("load"),
    reps: text("reps"),
    rpe: real("rpe"),
    durationSeconds: integer("duration_seconds"),
    skipped: boolean("skipped").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("set_logs_session_block_set_unique_idx").on(
      t.sessionLogId,
      t.blockExerciseId,
      t.setNumber,
    ),
    index("set_logs_session_log_idx").on(t.sessionLogId),
  ],
);
