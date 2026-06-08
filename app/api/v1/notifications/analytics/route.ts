import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireCoachRead } from "@/lib/api/require-coach";
import { getNotificationAnalytics } from "@/lib/notifications/service";
import { parseAnalyticsQuery } from "@/lib/validators/notifications";

export const GET = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachRead();
  const searchParams = new URL(request.url).searchParams;
  const query = parseAnalyticsQuery(searchParams);
  const analytics = await getNotificationAnalytics(org.organizationId, query);
  return jsonOk(analytics);
});
