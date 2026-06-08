import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getPathwayIdFromPath } from "@/lib/api/pathway-route";
import { requireCoachRead, requireCoachWrite } from "@/lib/api/require-coach";
import {
  deletePathway,
  getPathwayTree,
  patchPathway,
} from "@/lib/pathways/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { patchPathwaySchema } from "@/lib/validators/pathways";

export const GET = withApiHandler(
  { requireOrg: true, requireFeature: "coaching_journeys" },
  async ({ request }) => {
    const org = await requireCoachRead();
    const id = getPathwayIdFromPath(request);
    const pathway = await getPathwayTree(org.organizationId, id);
    return jsonOk(pathway);
  },
);

export const PATCH = withApiHandler(
  { requireOrg: true, requireFeature: "coaching_journeys" },
  async ({ request }) => {
    const org = await requireCoachWrite();
    const id = getPathwayIdFromPath(request);
    const body = await parseJsonBody(patchPathwaySchema, request);
    const pathway = await patchPathway(org.organizationId, id, body);
    return jsonOk(pathway);
  },
);

export const DELETE = withApiHandler(
  { requireOrg: true, requireFeature: "coaching_journeys" },
  async ({ request }) => {
    const org = await requireCoachWrite();
    const id = getPathwayIdFromPath(request);
    await deletePathway(org.organizationId, id);
    return jsonOk({ deleted: true });
  },
);
