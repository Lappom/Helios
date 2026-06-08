import { requireRole } from "@/lib/auth/org-context";
import { checkQuota } from "@/lib/billing/access";
import { ClientsPageClient } from "@/components/coach/clients/clients-page-client";
import { listAllClientsForKanban } from "@/lib/clients/service";

export default async function CoachClientsPage() {
  const org = await requireRole(
    "org_owner",
    "org_admin",
    "coach",
    "assistant",
  );

  const [clients, quota] = await Promise.all([
    listAllClientsForKanban(org.organizationId),
    checkQuota("clients"),
  ]);

  return (
    <ClientsPageClient initialClients={clients} initialQuota={quota} />
  );
}
