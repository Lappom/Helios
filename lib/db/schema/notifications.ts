import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "../id";
import { clients } from "./clients";
import {
  notificationChannelEnum,
  notificationEventTypeEnum,
  notificationLogStatusEnum,
  notificationTriggerEnum,
} from "./enums";
import { organizations } from "./organization";

export const notificationTemplates = pgTable(
  "notification_templates",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    channel: notificationChannelEnum("channel").notNull(),
    subject: text("subject"),
    content: text("content").notNull(),
    trigger: notificationTriggerEnum("trigger").notNull().default("manual"),
    schedule: text("schedule"),
    eventType: notificationEventTypeEnum("event_type"),
    isActive: boolean("is_active").notNull().default(true),
    isSystem: boolean("is_system").notNull().default(false),
    createdByClerkUserId: text("created_by_clerk_user_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("notification_templates_org_idx").on(t.organizationId),
    index("notification_templates_org_trigger_event_idx").on(
      t.organizationId,
      t.trigger,
      t.eventType,
    ),
  ],
);

export const notificationLogs = pgTable(
  "notification_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    templateId: text("template_id").references(() => notificationTemplates.id, {
      onDelete: "set null",
    }),
    clientId: text("client_id").references(() => clients.id, {
      onDelete: "set null",
    }),
    recipientEmail: text("recipient_email"),
    channel: notificationChannelEnum("channel").notNull(),
    eventType: notificationEventTypeEnum("event_type"),
    status: notificationLogStatusEnum("status").notNull().default("queued"),
    subject: text("subject"),
    content: text("content").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    idempotencyKey: text("idempotency_key"),
    externalId: text("external_id"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    openedAt: timestamp("opened_at", { withTimezone: true }),
    clickedAt: timestamp("clicked_at", { withTimezone: true }),
    failureReason: text("failure_reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("notification_logs_org_idx").on(t.organizationId),
    index("notification_logs_org_client_channel_sent_idx").on(
      t.organizationId,
      t.clientId,
      t.channel,
      t.sentAt,
    ),
    uniqueIndex("notification_logs_idempotency_key_idx").on(t.idempotencyKey),
    index("notification_logs_external_id_idx").on(t.externalId),
  ],
);

export const pushSubscriptions = pgTable(
  "push_subscriptions",
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
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("push_subscriptions_org_client_idx").on(
      t.organizationId,
      t.clientId,
    ),
    uniqueIndex("push_subscriptions_endpoint_idx").on(t.endpoint),
  ],
);
