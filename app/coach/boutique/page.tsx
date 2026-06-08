import { BoutiquePageGate } from "@/components/coach/boutique/boutique-page-gate";
import { requireRole } from "@/lib/auth/org-context";
import { listServicesForCoach } from "@/lib/coach-profile/service";
import { listPromoCodes } from "@/lib/promo-codes/service";
import { listPrograms } from "@/lib/programs/service";

export default async function CoachBoutiquePage() {
  const org = await requireRole("org_owner", "org_admin", "coach", "assistant");

  const [services, promoCodes, programsResult] = await Promise.all([
    listServicesForCoach(org.organizationId, org.clerkUserId),
    listPromoCodes(org.organizationId),
    listPrograms(org.organizationId, {
      page: 1,
      limit: 100,
      offset: 0,
      status: "published",
    }),
  ]);

  return (
    <BoutiquePageGate
      initialServices={services}
      initialPromoCodes={promoCodes}
      programs={programsResult.items}
    />
  );
}
