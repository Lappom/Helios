import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireClient } from "@/lib/api/require-client";
import { parseDayKey } from "@/lib/programs/calendar-utils";
import { getEnrichedSchedule } from "@/lib/sessions/service";
import { scheduleQuerySchema } from "@/lib/validators/sessions";

export const GET = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const client = await requireClient();
  const url = new URL(request.url);
  const query = scheduleQuerySchema.safeParse({
    start: url.searchParams.get("start") ?? undefined,
    end: url.searchParams.get("end") ?? undefined,
  });

  let range: { start: Date; end: Date } | undefined;

  if (query.success && query.data.start && query.data.end) {
    const start = parseDayKey(query.data.start);
    const end = parseDayKey(query.data.end);
    end.setHours(23, 59, 59, 999);
    range = { start, end };
  }

  const payload = await getEnrichedSchedule(
    client.organizationId,
    client.clientId,
    range,
  );

  return jsonOk(payload);
});
