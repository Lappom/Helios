import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireCoachRead, requireCoachWrite } from "@/lib/api/require-coach";
import {
  getProfileForCoach,
  patchProfile,
} from "@/lib/coach-profile/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { patchCoachProfileSchema } from "@/lib/validators/coach-profile";

export const GET = withApiHandler({ requireOrg: true }, async () => {
  const org = await requireCoachRead();
  const profile = await getProfileForCoach(org.organizationId, org.clerkUserId);
  return jsonOk(profile);
});

export const PATCH = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const body = await parseJsonBody(patchCoachProfileSchema, request);
  const profile = await patchProfile(
    org.organizationId,
    org.clerkUserId,
    body,
  );
  return jsonOk(profile);
});
