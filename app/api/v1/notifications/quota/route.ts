import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireCoachRead } from "@/lib/api/require-coach";
import { getNotificationQuota } from "@/lib/notifications/service";

export const GET = withApiHandler({ requireOrg: true }, async () => {
  await requireCoachRead();
  const quota = await getNotificationQuota();
  return jsonOk(quota);
});
