import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { validateCheckoutPromoCode } from "@/lib/checkout/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { validatePromoCodeSchema } from "@/lib/validators/checkout";

export const POST = withApiHandler(
  { requireOrg: false, rateLimit: true },
  async ({ request }) => {
    const body = await parseJsonBody(validatePromoCodeSchema, request);
    const result = await validateCheckoutPromoCode(body.serviceId, body.code);
    return jsonOk(result);
  },
);
