import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getProgramIdFromPath } from "@/lib/api/program-route";
import { requireCoachRead } from "@/lib/api/require-coach";
import { problem } from "@/lib/api/response";
import { getProgramAnalytics } from "@/lib/sessions/analytics";
import { analyticsQuerySchema } from "@/lib/validators/sessions";

export const GET = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachRead();
  const programId = getProgramIdFromPath(request);
  const clientId = new URL(request.url).searchParams.get("clientId");
  const query = analyticsQuerySchema.safeParse({ clientId });

  if (!query.success) {
    throw problem({
      type: "validation-error",
      title: "Invalid query",
      status: 400,
      detail: "Query parameter clientId is required.",
    });
  }

  const analytics = await getProgramAnalytics(
    org.organizationId,
    programId,
    query.data.clientId,
  );

  return jsonOk(analytics);
});
