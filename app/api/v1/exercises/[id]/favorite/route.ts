import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getExerciseIdFromPath } from "@/lib/api/exercise-route";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { toggleFavorite } from "@/lib/exercises/service";

export const POST = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const id = getExerciseIdFromPath(request);
  const result = await toggleFavorite(
    org.organizationId,
    org.clerkUserId,
    id,
  );

  return jsonOk(result);
});
