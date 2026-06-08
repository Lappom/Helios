import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getPromoCodeIdFromPath } from "@/lib/api/promo-code-route";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { problem } from "@/lib/api/response";
import { deletePromoCode, patchPromoCode } from "@/lib/promo-codes/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { patchPromoCodeSchema } from "@/lib/validators/checkout";

export const PATCH = withApiHandler(
  { requireOrg: true, requireFeature: "shop" },
  async ({ request }) => {
    const org = await requireCoachWrite();
    const id = getPromoCodeIdFromPath(request);

    if (!id) {
      throw problem({
        type: "validation-error",
        title: "Invalid promo code id",
        status: 400,
        detail: "Promo code id is required.",
      });
    }

    const body = await parseJsonBody(patchPromoCodeSchema, request);
    const promo = await patchPromoCode(org.organizationId, id, body);
    return jsonOk(promo);
  },
);

export const DELETE = withApiHandler(
  { requireOrg: true, requireFeature: "shop" },
  async ({ request }) => {
    const org = await requireCoachWrite();
    const id = getPromoCodeIdFromPath(request);

    if (!id) {
      throw problem({
        type: "validation-error",
        title: "Invalid promo code id",
        status: 400,
        detail: "Promo code id is required.",
      });
    }

    await deletePromoCode(org.organizationId, id);
    return jsonOk({ ok: true });
  },
);
