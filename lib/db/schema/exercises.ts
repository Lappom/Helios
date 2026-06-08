import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "../id";
import { exerciseSourceEnum, exerciseTypeEnum } from "./enums";
import { organizations } from "./organization";

export type ExerciseMedia = {
  thumbnailUrl?: string;
  videoUrl?: string;
  animationUrl?: string;
  videoType?: "youtube" | "blob";
};

export const exerciseCategories = pgTable(
  "exercise_categories",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("exercise_categories_org_name_idx").on(
      t.organizationId,
      t.name,
    ),
  ],
);

export const exercises = pgTable(
  "exercises",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    slug: text("slug"),
    name: text("name").notNull(),
    description: text("description"),
    instructions: text("instructions"),
    muscleGroups: text("muscle_groups").array().notNull().default([]),
    equipment: text("equipment").array().notNull().default([]),
    type: exerciseTypeEnum("type").notNull().default("strength"),
    source: exerciseSourceEnum("source").notNull().default("custom"),
    media: jsonb("media").$type<ExerciseMedia>().notNull().default({}),
    categoryId: text("category_id").references(() => exerciseCategories.id, {
      onDelete: "set null",
    }),
    createdByClerkUserId: text("created_by_clerk_user_id"),
    searchVector: text("search_vector").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("exercises_system_slug_idx")
      .on(t.slug)
      .where(sql`${t.source} = 'system'`),
    index("exercises_org_source_idx").on(t.organizationId, t.source),
    index("exercises_type_idx").on(t.type),
  ],
);

export const exerciseFavorites = pgTable(
  "exercise_favorites",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    clerkUserId: text("clerk_user_id").notNull(),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("exercise_favorites_org_user_exercise_idx").on(
      t.organizationId,
      t.clerkUserId,
      t.exerciseId,
    ),
  ],
);

export const exerciseAliases = pgTable(
  "exercise_aliases",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    alias: text("alias").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("exercise_aliases_org_exercise_idx").on(
      t.organizationId,
      t.exerciseId,
    ),
  ],
);

export const exerciseHidden = pgTable(
  "exercise_hidden",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("exercise_hidden_org_exercise_idx").on(
      t.organizationId,
      t.exerciseId,
    ),
  ],
);
