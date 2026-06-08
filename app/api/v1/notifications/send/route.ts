import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { sendManualNotification } from "@/lib/notifications/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { sendNotificationSchema } from "@/lib/validators/notifications";

export const POST = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const body = await parseJsonBody(sendNotificationSchema, request);
  const result = await sendManualNotification(
    org.organizationId,
    org.planTier,
    body,
  );

  return jsonOk(result, { status: 201 });
});
