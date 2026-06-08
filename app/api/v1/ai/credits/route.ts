import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { AI_CREDIT_COSTS } from "@/lib/billing/ai-credits";
import { checkQuota } from "@/lib/billing/access";

export const GET = withApiHandler({ requireOrg: true }, async () => {
  const quota = await checkQuota("ai");

  return jsonOk({
    quota,
    costs: AI_CREDIT_COSTS,
  });
});
