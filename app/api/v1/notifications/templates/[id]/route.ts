import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getNotificationTemplateIdFromPath } from "@/lib/api/notifications-route";
import { problem } from "@/lib/api/response";
import { requireCoachRead, requireCoachWrite } from "@/lib/api/require-coach";
import {
  deleteNotificationTemplate,
  getNotificationTemplate,
  updateNotificationTemplate,
} from "@/lib/notifications/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { updateNotificationTemplateSchema } from "@/lib/validators/notifications";

function requireTemplateId(request: Request): string {
  const templateId = getNotificationTemplateIdFromPath(request);
  if (!templateId) {
    throw problem({
      type: "validation-error",
      title: "Invalid template id",
      status: 400,
      detail: "Template id is required.",
    });
  }
  return templateId;
}

export const GET = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachRead();
  const template = await getNotificationTemplate(
    org.organizationId,
    requireTemplateId(request),
  );
  return jsonOk(template);
});

export const PATCH = withApiHandler(
  { requireOrg: true },
  async ({ request }) => {
    const org = await requireCoachWrite();
    const body = await parseJsonBody(updateNotificationTemplateSchema, request);
    const template = await updateNotificationTemplate(
      org.organizationId,
      requireTemplateId(request),
      body,
    );
    return jsonOk(template);
  },
);

export const DELETE = withApiHandler(
  { requireOrg: true },
  async ({ request }) => {
    const org = await requireCoachWrite();
    await deleteNotificationTemplate(
      org.organizationId,
      requireTemplateId(request),
    );
    return jsonOk({ deleted: true });
  },
);
