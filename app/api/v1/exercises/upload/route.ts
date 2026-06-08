import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { problem } from "@/lib/api/response";
import { requireCoachWrite } from "@/lib/api/require-coach";
import {
  assertExerciseVideoUploadAllowed,
  putExerciseVideo,
} from "@/lib/storage/blob";

export const POST = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
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

  assertExerciseVideoUploadAllowed(org.planTier, file);
  const uploaded = await putExerciseVideo(file, org.organizationId);

  return jsonOk({
    url: uploaded.url,
    pathname: uploaded.pathname,
    videoType: "blob" as const,
  });
});
