import { NotificationsPageClient } from "@/components/coach/notifications/notifications-page-client";
import { requireRole } from "@/lib/auth/org-context";
import { checkQuota } from "@/lib/billing/access";
import { listAllClientsForKanban } from "@/lib/clients/service";
import {
  getNotificationAnalytics,
  listNotificationTemplates,
  seedSystemNotificationTemplatesIfMissing,
} from "@/lib/notifications/service";

export default async function CoachNotificationsPage() {
  const org = await requireRole("org_owner", "org_admin", "coach", "assistant");

  await seedSystemNotificationTemplatesIfMissing(
    org.organizationId,
    org.clerkUserId,
  );

  const [templatesResult, analytics, clients] = await Promise.all([
    listNotificationTemplates(org.organizationId, {
      page: 1,
      limit: 100,
      offset: 0,
    }),
    getNotificationAnalytics(org.organizationId, {}),
    listAllClientsForKanban(org.organizationId),
  ]);

  const quota = await checkQuota("notifications");

  return (
    <NotificationsPageClient
      initialTemplates={templatesResult.items}
      initialAnalytics={analytics}
      initialQuota={quota}
      clients={clients}
    />
  );
}
