import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireClient } from "@/lib/api/require-client";
import {
  registerPushSubscription,
  removePushSubscription,
} from "@/lib/notifications/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { pushSubscriptionSchema } from "@/lib/validators/notifications";

export const POST = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireClient();
  const body = await parseJsonBody(pushSubscriptionSchema, request);
  const userAgent = request.headers.get("user-agent") ?? undefined;

  await registerPushSubscription(
    org.organizationId,
    org.clientId,
    body,
    userAgent,
  );

  return jsonOk({ registered: true }, { status: 201 });
});

export const DELETE = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireClient();
  const body = await parseJsonBody(pushSubscriptionSchema, request);

  await removePushSubscription(
    org.organizationId,
    org.clientId,
    body.endpoint,
  );

  return jsonOk({ deleted: true });
});
