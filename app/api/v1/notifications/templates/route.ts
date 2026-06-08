import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { parsePagination, withTotalCountHeaders } from "@/lib/api/pagination";
import { requireCoachRead, requireCoachWrite } from "@/lib/api/require-coach";
import {
  createNotificationTemplate,
  listNotificationTemplates,
  seedSystemNotificationTemplatesIfMissing,
} from "@/lib/notifications/service";
import { parseJsonBody } from "@/lib/validators/clients";
import {
  createNotificationTemplateSchema,
  parseListNotificationTemplatesQuery,
} from "@/lib/validators/notifications";

export const GET = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachRead();
  await seedSystemNotificationTemplatesIfMissing(
    org.organizationId,
    org.clerkUserId,
  );

  const searchParams = new URL(request.url).searchParams;
  const pagination = parsePagination(searchParams);
  const filters = parseListNotificationTemplatesQuery(searchParams);

  const { items, total } = await listNotificationTemplates(org.organizationId, {
    page: pagination.page,
    limit: pagination.limit,
    offset: pagination.offset,
    ...filters,
  });

  return jsonOk(
    {
      items,
      page: pagination.page,
      limit: pagination.limit,
    },
    { headers: withTotalCountHeaders(undefined, total) },
  );
});

export const POST = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const body = await parseJsonBody(createNotificationTemplateSchema, request);
  const template = await createNotificationTemplate(
    org.organizationId,
    org.clerkUserId,
    body,
  );

  return jsonOk(template, { status: 201 });
});
