CREATE TYPE "public"."session_log_status" AS ENUM('in_progress', 'completed', 'abandoned');--> statement-breakpoint
CREATE TABLE "session_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" text NOT NULL,
	"assignment_id" text NOT NULL,
	"program_session_id" text NOT NULL,
	"scheduled_date" timestamp with time zone NOT NULL,
	"status" "session_log_status" DEFAULT 'in_progress' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "set_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"session_log_id" text NOT NULL,
	"block_exercise_id" text NOT NULL,
	"set_prescription_id" text,
	"set_number" integer NOT NULL,
	"exercise_id" text NOT NULL,
	"load" text,
	"reps" text,
	"rpe" real,
	"duration_seconds" integer,
	"skipped" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session_logs" ADD CONSTRAINT "session_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_logs" ADD CONSTRAINT "session_logs_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_logs" ADD CONSTRAINT "session_logs_assignment_id_program_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."program_assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_logs" ADD CONSTRAINT "session_logs_program_session_id_program_sessions_id_fk" FOREIGN KEY ("program_session_id") REFERENCES "public"."program_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_logs" ADD CONSTRAINT "set_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_logs" ADD CONSTRAINT "set_logs_session_log_id_session_logs_id_fk" FOREIGN KEY ("session_log_id") REFERENCES "public"."session_logs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_logs" ADD CONSTRAINT "set_logs_block_exercise_id_block_exercises_id_fk" FOREIGN KEY ("block_exercise_id") REFERENCES "public"."block_exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_logs" ADD CONSTRAINT "set_logs_set_prescription_id_set_prescriptions_id_fk" FOREIGN KEY ("set_prescription_id") REFERENCES "public"."set_prescriptions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_logs" ADD CONSTRAINT "set_logs_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "session_logs_assignment_session_date_unique_idx" ON "session_logs" USING btree ("assignment_id","program_session_id","scheduled_date");--> statement-breakpoint
CREATE INDEX "session_logs_org_client_status_idx" ON "session_logs" USING btree ("organization_id","client_id","status");--> statement-breakpoint
CREATE INDEX "session_logs_assignment_idx" ON "session_logs" USING btree ("assignment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "set_logs_session_block_set_unique_idx" ON "set_logs" USING btree ("session_log_id","block_exercise_id","set_number");--> statement-breakpoint
CREATE INDEX "set_logs_session_log_idx" ON "set_logs" USING btree ("session_log_id");