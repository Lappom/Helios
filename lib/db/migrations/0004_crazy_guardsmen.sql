CREATE TYPE "public"."program_assignment_status" AS ENUM('active', 'completed', 'paused', 'cancelled');--> statement-breakpoint
CREATE TABLE "assignment_session_overrides" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"assignment_id" text NOT NULL,
	"program_session_id" text NOT NULL,
	"scheduled_date" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"program_id" text NOT NULL,
	"client_id" text NOT NULL,
	"coach_clerk_user_id" text NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"status" "program_assignment_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assignment_session_overrides" ADD CONSTRAINT "assignment_session_overrides_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment_session_overrides" ADD CONSTRAINT "assignment_session_overrides_assignment_id_program_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."program_assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment_session_overrides" ADD CONSTRAINT "assignment_session_overrides_program_session_id_program_sessions_id_fk" FOREIGN KEY ("program_session_id") REFERENCES "public"."program_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_assignments" ADD CONSTRAINT "program_assignments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_assignments" ADD CONSTRAINT "program_assignments_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_assignments" ADD CONSTRAINT "program_assignments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assignment_session_overrides_assignment_idx" ON "assignment_session_overrides" USING btree ("assignment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "assignment_session_overrides_unique_idx" ON "assignment_session_overrides" USING btree ("assignment_id","program_session_id");--> statement-breakpoint
CREATE INDEX "program_assignments_org_program_idx" ON "program_assignments" USING btree ("organization_id","program_id");--> statement-breakpoint
CREATE INDEX "program_assignments_org_client_status_idx" ON "program_assignments" USING btree ("organization_id","client_id","status");