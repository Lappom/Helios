import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireCoachRead } from "@/lib/api/require-coach";
import { getOrgWeeklyHabitSummary } from "@/lib/habits/service";

export const GET = withApiHandler(
  { requireOrg: true, requireFeature: "habits" },
  async () => {
    const org = await requireCoachRead();
    const summary = await getOrgWeeklyHabitSummary(org.organizationId);
    return jsonOk(summary);
  },
);
