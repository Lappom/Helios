CREATE TYPE "public"."habit_assignment_status" AS ENUM('active', 'paused', 'completed');--> statement-breakpoint
CREATE TYPE "public"."habit_frequency" AS ENUM('daily', 'weekly');--> statement-breakpoint
CREATE TABLE "habit_assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"habit_id" text NOT NULL,
	"client_id" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"reminder_time" text,
	"status" "habit_assignment_status" DEFAULT 'active' NOT NULL,
	"assigned_by_clerk_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"assignment_id" text NOT NULL,
	"client_id" text NOT NULL,
	"log_date" date NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habits" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"coach_clerk_user_id" text,
	"name" text NOT NULL,
	"emoji" text DEFAULT '✅' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"frequency" "habit_frequency" DEFAULT 'daily' NOT NULL,
	"is_predefined" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "habit_assignments" ADD CONSTRAINT "habit_assignments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habit_assignments" ADD CONSTRAINT "habit_assignments_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habit_assignments" ADD CONSTRAINT "habit_assignments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_assignment_id_habit_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."habit_assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habits" ADD CONSTRAINT "habits_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "habit_assignments_org_client_idx" ON "habit_assignments" USING btree ("organization_id","client_id","status");--> statement-breakpoint
CREATE INDEX "habit_assignments_org_habit_idx" ON "habit_assignments" USING btree ("organization_id","habit_id");--> statement-breakpoint
CREATE INDEX "habit_assignments_reminder_idx" ON "habit_assignments" USING btree ("reminder_time","status");--> statement-breakpoint
CREATE UNIQUE INDEX "habit_logs_assignment_date_unique_idx" ON "habit_logs" USING btree ("assignment_id","log_date");--> statement-breakpoint
CREATE INDEX "habit_logs_org_client_date_idx" ON "habit_logs" USING btree ("organization_id","client_id","log_date");--> statement-breakpoint
CREATE INDEX "habit_logs_assignment_idx" ON "habit_logs" USING btree ("assignment_id");--> statement-breakpoint
CREATE INDEX "habits_org_idx" ON "habits" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "habits_org_predefined_idx" ON "habits" USING btree ("organization_id","is_predefined");