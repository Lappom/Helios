import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { parsePagination, withTotalCountHeaders } from "@/lib/api/pagination";
import { getPathwayIdFromPath } from "@/lib/api/pathway-route";
import { requireCoachRead } from "@/lib/api/require-coach";
import { listPathwayEnrollments } from "@/lib/pathways/service";
import { parseListPathwayEnrollmentsQuery } from "@/lib/validators/pathways";

export const GET = withApiHandler(
  { requireOrg: true, requireFeature: "coaching_journeys" },
  async ({ request }) => {
    const org = await requireCoachRead();
    const id = getPathwayIdFromPath(request);
    const searchParams = new URL(request.url).searchParams;
    const pagination = parsePagination(searchParams);
    const query = parseListPathwayEnrollmentsQuery(searchParams, pagination);
    const { items, total } = await listPathwayEnrollments(
      org.organizationId,
      id,
      query,
    );

    return jsonOk(
      { items, page: pagination.page, limit: pagination.limit },
      { headers: withTotalCountHeaders(undefined, total) },
    );
  },
);
