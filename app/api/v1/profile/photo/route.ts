import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { problem } from "@/lib/api/response";
import { requireCoachWrite } from "@/lib/api/require-coach";
import {
  getProfileForCoach,
  updateProfilePhoto,
} from "@/lib/coach-profile/service";
import { putCoachProfilePhoto } from "@/lib/storage/blob";

export const POST = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const profile = await getProfileForCoach(org.organizationId, org.clerkUserId);
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw problem({
      type: "validation-error",
      title: "Missing file",
      status: 400,
      detail: "Multipart field 'file' is required.",
    });
  }

  const uploaded = await putCoachProfilePhoto(
    file,
    org.organizationId,
    profile.id,
  );
  const updated = await updateProfilePhoto(
    org.organizationId,
    org.clerkUserId,
    uploaded.url,
  );

  return jsonOk({
    profile: updated,
    url: uploaded.url,
    pathname: uploaded.pathname,
  });
});
