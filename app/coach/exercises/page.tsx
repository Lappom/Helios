import { requireRole } from "@/lib/auth/org-context";
import { ExercisesPageClient } from "@/components/coach/exercises/exercises-page-client";
import { listCategories, listExercises } from "@/lib/exercises/service";

export default async function CoachExercisesPage() {
  const org = await requireRole(
    "org_owner",
    "org_admin",
    "coach",
    "assistant",
  );

  const [{ items, total }, categories] = await Promise.all([
    listExercises(org.organizationId, org.clerkUserId, {
      page: 1,
      limit: 24,
      offset: 0,
    }),
    listCategories(org.organizationId),
  ]);

  return (
    <ExercisesPageClient
      initialItems={items}
      initialTotal={total}
      initialCategories={categories}
      planTier={org.planTier}
    />
  );
}
