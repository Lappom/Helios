import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getProgramIdFromPath } from "@/lib/api/program-route";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { problem } from "@/lib/api/response";
import { assignProgram } from "@/lib/programs/assignments";
import { assignProgramSchema } from "@/lib/validators/programs";

export const POST = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const programId = getProgramIdFromPath(request);

  if (!programId) {
    throw problem({
      type: "validation-error",
      title: "Invalid program id",
      status: 400,
      detail: "Program id is required.",
    });
  }

  const body = assignProgramSchema.parse(await request.json());
  const result = await assignProgram(
    org.organizationId,
    programId,
    org.clerkUserId,
    body,
  );

  return jsonOk(result);
});
