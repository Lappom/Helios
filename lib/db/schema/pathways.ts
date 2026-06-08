import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "../id";
import { clients } from "./clients";
import {
  pathwayEnrollmentStatusEnum,
  pathwayStepLogStatusEnum,
  pathwayStepTypeEnum,
} from "./enums";
import { organizations } from "./organization";

export const coachingPathways = pgTable(
  "coaching_pathways",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    coachClerkUserId: text("coach_clerk_user_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    isActive: boolean("is_active").notNull().default(false),
    autoEnrollOnClientCreated: boolean("auto_enroll_on_client_created")
      .notNull()
      .default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("coaching_pathways_org_idx").on(t.organizationId),
    index("coaching_pathways_org_active_idx").on(t.organizationId, t.isActive),
    index("coaching_pathways_org_auto_enroll_idx").on(
      t.organizationId,
      t.autoEnrollOnClientCreated,
      t.isActive,
    ),
  ],
);

export const pathwaySteps = pgTable(
  "pathway_steps",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    pathwayId: text("pathway_id")
      .notNull()
      .references(() => coachingPathways.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    stepType: pathwayStepTypeEnum("step_type").notNull(),
    delayDays: integer("delay_days").notNull().default(0),
    stepConfig: jsonb("step_config")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("pathway_steps_pathway_sort_idx").on(t.pathwayId, t.sortOrder),
    uniqueIndex("pathway_steps_pathway_sort_unique_idx").on(
      t.pathwayId,
      t.sortOrder,
    ),
  ],
);

export const pathwayEnrollments = pgTable(
  "pathway_enrollments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    pathwayId: text("pathway_id")
      .notNull()
      .references(() => coachingPathways.id, { onDelete: "cascade" }),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    triggerEventId: text("trigger_event_id").notNull(),
    status: pathwayEnrollmentStatusEnum("status").notNull().default("pending"),
    currentStepIndex: integer("current_step_index").notNull().default(0),
    error: text("error"),
    startedAt: timestamp("started_at", { withTimezone: true }),
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
    uniqueIndex("pathway_enrollments_pathway_client_idx").on(
      t.pathwayId,
      t.clientId,
    ),
    uniqueIndex("pathway_enrollments_idempotency_idx").on(
      t.pathwayId,
      t.clientId,
      t.triggerEventId,
    ),
    index("pathway_enrollments_org_pathway_idx").on(
      t.organizationId,
      t.pathwayId,
      t.createdAt,
    ),
    index("pathway_enrollments_org_status_idx").on(t.organizationId, t.status),
  ],
);

export const pathwayStepLogs = pgTable(
  "pathway_step_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    enrollmentId: text("enrollment_id")
      .notNull()
      .references(() => pathwayEnrollments.id, { onDelete: "cascade" }),
    stepId: text("step_id")
      .notNull()
      .references(() => pathwaySteps.id, { onDelete: "cascade" }),
    status: pathwayStepLogStatusEnum("status").notNull().default("pending"),
    output: jsonb("output").$type<Record<string, unknown>>(),
    error: text("error"),
    durationMs: integer("duration_ms"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("pathway_step_logs_enrollment_step_idx").on(
      t.enrollmentId,
      t.stepId,
    ),
    index("pathway_step_logs_org_enrollment_idx").on(
      t.organizationId,
      t.enrollmentId,
    ),
  ],
);
