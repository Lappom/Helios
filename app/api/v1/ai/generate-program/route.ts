import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireCoachWrite } from "@/lib/api/require-coach";
import {
  AI_CREDIT_COSTS,
  consumeAiCredits,
} from "@/lib/billing/ai-credits";
import { checkQuota } from "@/lib/billing/access";
import { generateProgramFromPrompt } from "@/lib/ai/services/generate-program";
import { parseJsonBody } from "@/lib/validators/clients";
import { aiGenerateProgramSchema } from "@/lib/validators/ai";
import { problem } from "@/lib/api/response";

export const maxDuration = 120;

export const POST = withApiHandler(
  {
    requireOrg: true,
    requireFeature: "advanced_ai",
    rateLimit: true,
  },
  async ({ request }) => {
    const coach = await requireCoachWrite();
    const body = await parseJsonBody(aiGenerateProgramSchema, request);

    const quota = await checkQuota("ai");
    if (
      quota.limit !== Number.POSITIVE_INFINITY &&
      quota.remaining < AI_CREDIT_COSTS.generateProgram
    ) {
      throw problem({
        type: "quota-exceeded",
        title: "Quota exceeded",
        status: 402,
        detail: `ai quota exceeded (${quota.used}/${quota.limit}).`,
      });
    }

    const { program, unresolvedExercises } = await generateProgramFromPrompt(
      coach.organizationId,
      coach.clerkUserId,
      body,
    );

    const credits = await consumeAiCredits(
      coach.organizationId,
      AI_CREDIT_COSTS.generateProgram,
      coach.planTier,
    );

    return jsonOk(
      {
        program,
        unresolvedExercises,
        credits,
      },
      { status: 201 },
    );
  },
);
