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
import { coachServiceTypeEnum } from "./enums";
import { organizations } from "./organization";

export type CoachSocialLinks = {
  instagram?: string;
  website?: string;
  youtube?: string;
};

export const coachProfiles = pgTable(
  "coach_profiles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    clerkUserId: text("clerk_user_id").notNull(),
    slug: text("slug").notNull(),
    displayName: text("display_name").notNull().default(""),
    bio: text("bio"),
    photoUrl: text("photo_url"),
    certifications: jsonb("certifications")
      .$type<string[]>()
      .notNull()
      .default([]),
    specialties: jsonb("specialties")
      .$type<string[]>()
      .notNull()
      .default([]),
    languages: jsonb("languages")
      .$type<string[]>()
      .notNull()
      .default([]),
    location: text("location"),
    socialLinks: jsonb("social_links")
      .$type<CoachSocialLinks>()
      .notNull()
      .default({}),
    isPublished: boolean("is_published").notNull().default(false),
    isInDirectory: boolean("is_in_directory").notNull().default(false),
    timezone: text("timezone").notNull().default("Europe/Paris"),
    cancellationHoursBefore: integer("cancellation_hours_before")
      .notNull()
      .default(24),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("coach_profiles_slug_idx").on(t.slug),
    uniqueIndex("coach_profiles_org_user_idx").on(
      t.organizationId,
      t.clerkUserId,
    ),
    index("coach_profiles_directory_idx").on(t.isPublished, t.isInDirectory),
    index("coach_profiles_org_idx").on(t.organizationId),
  ],
);

export const coachServices = pgTable(
  "coach_services",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    profileId: text("profile_id")
      .notNull()
      .references(() => coachProfiles.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    durationMinutes: integer("duration_minutes").notNull(),
    priceCents: integer("price_cents").notNull(),
    currency: text("currency").notNull().default("EUR"),
    type: coachServiceTypeEnum("type").notNull().default("coaching"),
    isOnline: boolean("is_online").notNull().default(false),
    bookingEnabled: boolean("booking_enabled").notNull().default(false),
    paymentInstructions: text("payment_instructions"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("coach_services_profile_idx").on(t.profileId),
    index("coach_services_org_idx").on(t.organizationId),
  ],
);
