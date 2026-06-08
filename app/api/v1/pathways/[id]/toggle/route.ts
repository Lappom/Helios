import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getPathwayIdFromPath } from "@/lib/api/pathway-route";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { togglePathway } from "@/lib/pathways/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { togglePathwaySchema } from "@/lib/validators/pathways";

export const POST = withApiHandler(
  { requireOrg: true, requireFeature: "coaching_journeys" },
  async ({ request }) => {
    const org = await requireCoachWrite();
    const id = getPathwayIdFromPath(request);
    const body = await parseJsonBody(togglePathwaySchema, request);
    const pathway = await togglePathway(org.organizationId, id, body.isActive);
    return jsonOk(pathway);
  },
);
