import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getClientIdFromPath } from "@/lib/api/client-route";
import { requireCoachRead } from "@/lib/api/require-coach";
import { getClientHabitStats } from "@/lib/habits/service";
import { parseHabitStatsQuery } from "@/lib/validators/habits";

export const GET = withApiHandler(
  { requireOrg: true, requireFeature: "habits" },
  async ({ request }) => {
    const org = await requireCoachRead();
    const clientId = getClientIdFromPath(request);
    const searchParams = new URL(request.url).searchParams;
    const query = parseHabitStatsQuery(searchParams);
    const report = await getClientHabitStats(
      org.organizationId,
      clientId,
      query,
    );

    return jsonOk(report);
  },
);
