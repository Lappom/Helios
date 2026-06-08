import { requireRole } from "@/lib/auth/org-context";
import { HabitsPageGate } from "@/components/coach/habits/habits-page-gate";
import {
  getOrgWeeklyHabitSummary,
  listHabits,
  seedPredefinedHabitsIfMissing,
} from "@/lib/habits/service";

export default async function CoachHabitsPage() {
  const org = await requireRole("org_owner", "org_admin", "coach", "assistant");
  await seedPredefinedHabitsIfMissing(org.organizationId, org.clerkUserId);

  const [{ items }, weeklySummary] = await Promise.all([
    listHabits(org.organizationId, { page: 1, limit: 100, offset: 0 }),
    getOrgWeeklyHabitSummary(org.organizationId),
  ]);

  return (
    <HabitsPageGate initialHabits={items} weeklySummary={weeklySummary} />
  );
}
