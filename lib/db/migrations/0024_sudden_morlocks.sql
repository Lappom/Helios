CREATE TYPE "public"."pathway_enrollment_status" AS ENUM('pending', 'running', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."pathway_step_log_status" AS ENUM('pending', 'completed', 'failed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."pathway_step_type" AS ENUM('program', 'assessment', 'message', 'wait');--> statement-breakpoint
CREATE TABLE "coaching_pathways" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"coach_clerk_user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT false NOT NULL,
	"auto_enroll_on_client_created" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pathway_enrollments" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"pathway_id" text NOT NULL,
	"client_id" text NOT NULL,
	"trigger_event_id" text NOT NULL,
	"status" "pathway_enrollment_status" DEFAULT 'pending' NOT NULL,
	"current_step_index" integer DEFAULT 0 NOT NULL,
	"error" text,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pathway_step_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"enrollment_id" text NOT NULL,
	"step_id" text NOT NULL,
	"status" "pathway_step_log_status" DEFAULT 'pending' NOT NULL,
	"output" jsonb,
	"error" text,
	"duration_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pathway_steps" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"pathway_id" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"step_type" "pathway_step_type" NOT NULL,
	"delay_days" integer DEFAULT 0 NOT NULL,
	"step_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coaching_pathways" ADD CONSTRAINT "coaching_pathways_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pathway_enrollments" ADD CONSTRAINT "pathway_enrollments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pathway_enrollments" ADD CONSTRAINT "pathway_enrollments_pathway_id_coaching_pathways_id_fk" FOREIGN KEY ("pathway_id") REFERENCES "public"."coaching_pathways"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pathway_enrollments" ADD CONSTRAINT "pathway_enrollments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pathway_step_logs" ADD CONSTRAINT "pathway_step_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pathway_step_logs" ADD CONSTRAINT "pathway_step_logs_enrollment_id_pathway_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."pathway_enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pathway_step_logs" ADD CONSTRAINT "pathway_step_logs_step_id_pathway_steps_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."pathway_steps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pathway_steps" ADD CONSTRAINT "pathway_steps_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pathway_steps" ADD CONSTRAINT "pathway_steps_pathway_id_coaching_pathways_id_fk" FOREIGN KEY ("pathway_id") REFERENCES "public"."coaching_pathways"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "coaching_pathways_org_idx" ON "coaching_pathways" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "coaching_pathways_org_active_idx" ON "coaching_pathways" USING btree ("organization_id","is_active");--> statement-breakpoint
CREATE INDEX "coaching_pathways_org_auto_enroll_idx" ON "coaching_pathways" USING btree ("organization_id","auto_enroll_on_client_created","is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "pathway_enrollments_pathway_client_idx" ON "pathway_enrollments" USING btree ("pathway_id","client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pathway_enrollments_idempotency_idx" ON "pathway_enrollments" USING btree ("pathway_id","client_id","trigger_event_id");--> statement-breakpoint
CREATE INDEX "pathway_enrollments_org_pathway_idx" ON "pathway_enrollments" USING btree ("organization_id","pathway_id","created_at");--> statement-breakpoint
CREATE INDEX "pathway_enrollments_org_status_idx" ON "pathway_enrollments" USING btree ("organization_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "pathway_step_logs_enrollment_step_idx" ON "pathway_step_logs" USING btree ("enrollment_id","step_id");--> statement-breakpoint
CREATE INDEX "pathway_step_logs_org_enrollment_idx" ON "pathway_step_logs" USING btree ("organization_id","enrollment_id");--> statement-breakpoint
CREATE INDEX "pathway_steps_pathway_sort_idx" ON "pathway_steps" USING btree ("pathway_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "pathway_steps_pathway_sort_unique_idx" ON "pathway_steps" USING btree ("pathway_id","sort_order");