import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireCoachRead, requireCoachWrite } from "@/lib/api/require-coach";
import { createCategory, listCategories } from "@/lib/exercises/service";
import { createCategorySchema } from "@/lib/validators/exercises";
import { parseJsonBody } from "@/lib/validators/clients";

export const GET = withApiHandler({ requireOrg: true }, async () => {
  const org = await requireCoachRead();
  const categories = await listCategories(org.organizationId);

  return jsonOk({ items: categories });
});

export const POST = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const body = await parseJsonBody(createCategorySchema, request);
  const category = await createCategory(org.organizationId, body);

  return jsonOk(category, { status: 201 });
});
