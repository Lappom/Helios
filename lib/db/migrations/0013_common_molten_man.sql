CREATE TYPE "public"."booking_payment_status" AS ENUM('unpaid', 'paid', 'external');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show');--> statement-breakpoint
CREATE TABLE "availability_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"coach_clerk_user_id" text NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"slot_duration_minutes" integer NOT NULL,
	"service_types" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blocked_dates" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"coach_clerk_user_id" text NOT NULL,
	"date" date NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"coach_clerk_user_id" text NOT NULL,
	"service_id" text NOT NULL,
	"client_id" text,
	"prospect_email" text,
	"prospect_name" text,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"timezone" text DEFAULT 'Europe/Paris' NOT NULL,
	"status" "booking_status" DEFAULT 'confirmed' NOT NULL,
	"payment_status" "booking_payment_status" DEFAULT 'unpaid' NOT NULL,
	"notes" text,
	"cancellation_reason" text,
	"reminders_sent" jsonb DEFAULT '{"d1":false,"h1":false}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coach_profiles" ADD COLUMN "timezone" text DEFAULT 'Europe/Paris' NOT NULL;--> statement-breakpoint
ALTER TABLE "coach_profiles" ADD COLUMN "cancellation_hours_before" integer DEFAULT 24 NOT NULL;--> statement-breakpoint
ALTER TABLE "availability_rules" ADD CONSTRAINT "availability_rules_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blocked_dates" ADD CONSTRAINT "blocked_dates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_id_coach_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."coach_services"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "availability_rules_org_coach_idx" ON "availability_rules" USING btree ("organization_id","coach_clerk_user_id");--> statement-breakpoint
CREATE INDEX "availability_rules_day_idx" ON "availability_rules" USING btree ("day_of_week");--> statement-breakpoint
CREATE INDEX "blocked_dates_org_coach_idx" ON "blocked_dates" USING btree ("organization_id","coach_clerk_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "blocked_dates_coach_date_unique_idx" ON "blocked_dates" USING btree ("organization_id","coach_clerk_user_id","date");--> statement-breakpoint
CREATE INDEX "bookings_org_coach_idx" ON "bookings" USING btree ("organization_id","coach_clerk_user_id");--> statement-breakpoint
CREATE INDEX "bookings_org_start_idx" ON "bookings" USING btree ("organization_id","start_at");--> statement-breakpoint
CREATE INDEX "bookings_client_idx" ON "bookings" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "bookings_service_idx" ON "bookings" USING btree ("service_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_coach_start_active_unique_idx" ON "bookings" USING btree ("organization_id","coach_clerk_user_id","start_at") WHERE "bookings"."status" != 'cancelled';