import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { parsePagination, withTotalCountHeaders } from "@/lib/api/pagination";
import { requireCoachRead, requireCoachWrite } from "@/lib/api/require-coach";
import { createPathway, listPathways } from "@/lib/pathways/service";
import { parseJsonBody } from "@/lib/validators/clients";
import {
  createPathwaySchema,
  parseListPathwaysQuery,
} from "@/lib/validators/pathways";

export const GET = withApiHandler(
  { requireOrg: true, requireFeature: "coaching_journeys" },
  async ({ request }) => {
    const org = await requireCoachRead();
    const searchParams = new URL(request.url).searchParams;
    const pagination = parsePagination(searchParams);
    const query = parseListPathwaysQuery(searchParams, pagination);
    const { items, total } = await listPathways(org.organizationId, query);

    return jsonOk(
      { items, page: pagination.page, limit: pagination.limit },
      { headers: withTotalCountHeaders(undefined, total) },
    );
  },
);

export const POST = withApiHandler(
  { requireOrg: true, requireFeature: "coaching_journeys" },
  async ({ request }) => {
    const org = await requireCoachWrite();
    const body = await parseJsonBody(createPathwaySchema, request);
    const pathway = await createPathway(
      org.organizationId,
      org.clerkUserId,
      body,
    );
    return jsonOk(pathway, { status: 201 });
  },
);
