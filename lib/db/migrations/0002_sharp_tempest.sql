DROP TABLE IF EXISTS "exercise_hidden" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "exercise_favorites" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "exercise_aliases" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "exercise_categories" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."exercise_source" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."exercise_type" CASCADE;--> statement-breakpoint
CREATE TYPE "public"."exercise_source" AS ENUM('system', 'custom');--> statement-breakpoint
CREATE TYPE "public"."exercise_type" AS ENUM('strength', 'cardio', 'mobility', 'plyometric');--> statement-breakpoint
CREATE TABLE "exercise_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text,
	"slug" text,
	"name" text NOT NULL,
	"description" text,
	"instructions" text,
	"muscle_groups" text[] DEFAULT '{}' NOT NULL,
	"equipment" text[] DEFAULT '{}' NOT NULL,
	"type" "exercise_type" DEFAULT 'strength' NOT NULL,
	"source" "exercise_source" DEFAULT 'custom' NOT NULL,
	"media" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"category_id" text,
	"created_by_clerk_user_id" text,
	"search_vector" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise_aliases" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"alias" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise_favorites" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"clerk_user_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise_hidden" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercise_categories" ADD CONSTRAINT "exercise_categories_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_category_id_exercise_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."exercise_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_aliases" ADD CONSTRAINT "exercise_aliases_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_aliases" ADD CONSTRAINT "exercise_aliases_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_favorites" ADD CONSTRAINT "exercise_favorites_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_favorites" ADD CONSTRAINT "exercise_favorites_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_hidden" ADD CONSTRAINT "exercise_hidden_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_hidden" ADD CONSTRAINT "exercise_hidden_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "exercise_categories_org_name_idx" ON "exercise_categories" USING btree ("organization_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "exercises_system_slug_idx" ON "exercises" USING btree ("slug") WHERE "source" = 'system';--> statement-breakpoint
CREATE INDEX "exercises_org_source_idx" ON "exercises" USING btree ("organization_id","source");--> statement-breakpoint
CREATE INDEX "exercises_type_idx" ON "exercises" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "exercise_aliases_org_exercise_idx" ON "exercise_aliases" USING btree ("organization_id","exercise_id");--> statement-breakpoint
CREATE UNIQUE INDEX "exercise_favorites_org_user_exercise_idx" ON "exercise_favorites" USING btree ("organization_id","clerk_user_id","exercise_id");--> statement-breakpoint
CREATE UNIQUE INDEX "exercise_hidden_org_exercise_idx" ON "exercise_hidden" USING btree ("organization_id","exercise_id");--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
CREATE INDEX "exercises_search_trgm_idx" ON "exercises" USING gin ("search_vector" gin_trgm_ops);
