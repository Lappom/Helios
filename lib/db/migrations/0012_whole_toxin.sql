CREATE TYPE "public"."coach_service_type" AS ENUM('assessment', 'coaching', 'call');--> statement-breakpoint
CREATE TABLE "coach_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"clerk_user_id" text NOT NULL,
	"slug" text NOT NULL,
	"display_name" text DEFAULT '' NOT NULL,
	"bio" text,
	"photo_url" text,
	"certifications" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"specialties" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"languages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"location" text,
	"social_links" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"is_in_directory" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coach_services" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"profile_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"duration_minutes" integer NOT NULL,
	"price_cents" integer NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"type" "coach_service_type" DEFAULT 'coaching' NOT NULL,
	"is_online" boolean DEFAULT false NOT NULL,
	"booking_enabled" boolean DEFAULT false NOT NULL,
	"payment_instructions" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coach_profiles" ADD CONSTRAINT "coach_profiles_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_services" ADD CONSTRAINT "coach_services_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_services" ADD CONSTRAINT "coach_services_profile_id_coach_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."coach_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "coach_profiles_slug_idx" ON "coach_profiles" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "coach_profiles_org_user_idx" ON "coach_profiles" USING btree ("organization_id","clerk_user_id");--> statement-breakpoint
CREATE INDEX "coach_profiles_directory_idx" ON "coach_profiles" USING btree ("is_published","is_in_directory");--> statement-breakpoint
CREATE INDEX "coach_profiles_org_idx" ON "coach_profiles" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "coach_services_profile_idx" ON "coach_services" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "coach_services_org_idx" ON "coach_services" USING btree ("organization_id");