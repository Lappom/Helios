import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireCoachRead, requireCoachWrite } from "@/lib/api/require-coach";
import {
  createPromoCode,
  listPromoCodes,
} from "@/lib/promo-codes/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { createPromoCodeSchema } from "@/lib/validators/checkout";

export const GET = withApiHandler(
  { requireOrg: true, requireFeature: "shop" },
  async () => {
    const org = await requireCoachRead();
    const items = await listPromoCodes(org.organizationId);
    return jsonOk({ items });
  },
);

export const POST = withApiHandler(
  { requireOrg: true, requireFeature: "shop" },
  async ({ request }) => {
    const org = await requireCoachWrite();
    const body = await parseJsonBody(createPromoCodeSchema, request);
    const promo = await createPromoCode(org.organizationId, body);
    return jsonOk(promo, { status: 201 });
  },
);
