import { PathwaysPageGate } from "@/components/coach/pathways/pathways-page-gate";
import { requireRole } from "@/lib/auth/org-context";
import { listPathways } from "@/lib/pathways/service";

export default async function CoachPathwaysPage() {
  const org = await requireRole("org_owner", "org_admin", "coach", "assistant");

  const { items } = await listPathways(org.organizationId, {
    page: 1,
    limit: 100,
    offset: 0,
  });

  return <PathwaysPageGate initialPathways={items} />;
}
