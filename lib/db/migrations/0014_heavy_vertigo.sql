CREATE TYPE "public"."promo_discount_type" AS ENUM('percent', 'fixed');--> statement-breakpoint
CREATE TABLE "promo_codes" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"code" text NOT NULL,
	"label" text,
	"discount_type" "promo_discount_type" NOT NULL,
	"discount_value" integer NOT NULL,
	"max_redemptions" integer,
	"redemption_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"service_ids" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coach_services" ADD COLUMN "default_program_id" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "promo_code_id" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "discount_cents" integer;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "final_price_cents" integer;--> statement-breakpoint
ALTER TABLE "promo_codes" ADD CONSTRAINT "promo_codes_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "promo_codes_org_code_idx" ON "promo_codes" USING btree ("organization_id","code");--> statement-breakpoint
CREATE INDEX "promo_codes_org_idx" ON "promo_codes" USING btree ("organization_id");--> statement-breakpoint
ALTER TABLE "coach_services" ADD CONSTRAINT "coach_services_default_program_id_programs_id_fk" FOREIGN KEY ("default_program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_promo_code_id_promo_codes_id_fk" FOREIGN KEY ("promo_code_id") REFERENCES "public"."promo_codes"("id") ON DELETE set null ON UPDATE no action;