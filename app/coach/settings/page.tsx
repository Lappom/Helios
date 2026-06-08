import { CoachSettingsClient } from "@/components/coach/settings/coach-settings-client";
import { checkQuota } from "@/lib/billing/access";
import { requireRole } from "@/lib/auth/org-context";

export default async function CoachSettingsPage() {
  const org = await requireRole("org_owner", "org_admin", "coach");
  const aiQuota = await checkQuota("ai");

  return (
    <CoachSettingsClient planTier={org.planTier} aiQuota={aiQuota} />
  );
}
