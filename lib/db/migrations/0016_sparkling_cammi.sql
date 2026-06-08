CREATE TYPE "public"."notification_channel" AS ENUM('email', 'in_app', 'push');--> statement-breakpoint
CREATE TYPE "public"."notification_event_type" AS ENUM('session_due', 'assessment_due', 'habit_reminder', 'booking_reminder', 'payment_received', 'message_new', 'program_published');--> statement-breakpoint
CREATE TYPE "public"."notification_log_status" AS ENUM('queued', 'sent', 'failed', 'opened', 'clicked');--> statement-breakpoint
CREATE TYPE "public"."notification_trigger" AS ENUM('manual', 'scheduled', 'event');--> statement-breakpoint
CREATE TABLE "notification_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"template_id" text,
	"client_id" text,
	"recipient_email" text,
	"channel" "notification_channel" NOT NULL,
	"event_type" "notification_event_type",
	"status" "notification_log_status" DEFAULT 'queued' NOT NULL,
	"subject" text,
	"content" text NOT NULL,
	"metadata" jsonb,
	"idempotency_key" text,
	"external_id" text,
	"sent_at" timestamp with time zone,
	"opened_at" timestamp with time zone,
	"clicked_at" timestamp with time zone,
	"failure_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"channel" "notification_channel" NOT NULL,
	"subject" text,
	"content" text NOT NULL,
	"trigger" "notification_trigger" DEFAULT 'manual' NOT NULL,
	"schedule" text,
	"event_type" "notification_event_type",
	"is_active" boolean DEFAULT true NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_by_clerk_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" text NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_template_id_notification_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."notification_templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_templates" ADD CONSTRAINT "notification_templates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notification_logs_org_idx" ON "notification_logs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "notification_logs_org_client_channel_sent_idx" ON "notification_logs" USING btree ("organization_id","client_id","channel","sent_at");--> statement-breakpoint
CREATE UNIQUE INDEX "notification_logs_idempotency_key_idx" ON "notification_logs" USING btree ("idempotency_key");--> statement-breakpoint
CREATE INDEX "notification_logs_external_id_idx" ON "notification_logs" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "notification_templates_org_idx" ON "notification_templates" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "notification_templates_org_trigger_event_idx" ON "notification_templates" USING btree ("organization_id","trigger","event_type");--> statement-breakpoint
CREATE INDEX "push_subscriptions_org_client_idx" ON "push_subscriptions" USING btree ("organization_id","client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "push_subscriptions_endpoint_idx" ON "push_subscriptions" USING btree ("endpoint");