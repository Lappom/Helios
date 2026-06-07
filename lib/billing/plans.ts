import type { PlanTier } from "@/lib/auth/types";
import type { subscriptionStatusEnum } from "@/lib/db/schema/enums";

export type QuotaType = "clients" | "ai" | "notifications";

export type SubscriptionStatus =
  (typeof subscriptionStatusEnum.enumValues)[number];

export const PLAN_LIMITS: Record<
  PlanTier,
  Record<QuotaType, number>
> = {
  STARTER: { clients: 5, ai: 500, notifications: 200 },
  PRO: { clients: 50, ai: 5000, notifications: 1000 },
  BUSINESS: { clients: 500, ai: 10000, notifications: 5000 },
  TEAM: {
    clients: Number.POSITIVE_INFINITY,
    ai: Number.POSITIVE_INFINITY,
    notifications: Number.POSITIVE_INFINITY,
  },
};

const CLERK_PLAN_SLUG_MAP: Record<string, PlanTier> = {
  starter: "STARTER",
  pro: "PRO",
  business: "BUSINESS",
  team: "TEAM",
};

const CLERK_STATUS_MAP: Record<string, SubscriptionStatus> = {
  active: "ACTIVE",
  trialing: "TRIALING",
  past_due: "PAST_DUE",
  canceled: "CANCELED",
  cancelled: "CANCELED",
};

export function mapClerkPlanSlugToTier(slug: string): PlanTier {
  const normalized = slug.toLowerCase().replace(/_plan$/, "");
  return CLERK_PLAN_SLUG_MAP[normalized] ?? "STARTER";
}

export function mapClerkSubscriptionStatus(status: string): SubscriptionStatus {
  return CLERK_STATUS_MAP[status.toLowerCase()] ?? "TRIALING";
}

export function getPlanLimit(planTier: PlanTier, quota: QuotaType): number {
  return PLAN_LIMITS[planTier][quota];
}

export const CLERK_FEATURE_SLUGS = [
  "habits",
  "group_messaging",
  "automations",
  "api_access",
  "client_branding",
  "advanced_ai",
  "team_coaches",
  "custom_session_feedback",
  "recurring_questionnaires",
  "coaching_journeys",
  "shop",
  "priority_support",
] as const;

export type ClerkFeature = (typeof CLERK_FEATURE_SLUGS)[number];
