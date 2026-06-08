import type { UIMessage } from "ai";
import { withApiHandler } from "@/lib/api/handler";
import { requireCoachWrite } from "@/lib/api/require-coach";
import {
  AI_CREDIT_COSTS,
  consumeAiCredits,
} from "@/lib/billing/ai-credits";
import { checkQuota } from "@/lib/billing/access";
import { streamCoachChat } from "@/lib/ai/services/chat";
import { problem } from "@/lib/api/response";

export const maxDuration = 60;

export const POST = withApiHandler(
  { requireOrg: true, rateLimit: true },
  async ({ request, org }) => {
    const coach = await requireCoachWrite();

    if (!org) {
      throw problem({
        type: "unauthorized",
        title: "Authentication required",
        status: 401,
      });
    }

    const quota = await checkQuota("ai");
    if (
      quota.limit !== Number.POSITIVE_INFINITY &&
      quota.remaining < AI_CREDIT_COSTS.chat
    ) {
      throw problem({
        type: "quota-exceeded",
        title: "Quota exceeded",
        status: 402,
        detail: `ai quota exceeded (${quota.used}/${quota.limit}).`,
      });
    }

    const body = (await request.json()) as {
      messages: UIMessage[];
      context?: "programs" | "general";
    };

    if (!body.messages?.length) {
      throw problem({
        type: "validation-error",
        title: "Validation failed",
        status: 400,
        detail: "messages array is required.",
      });
    }

    const result = await streamCoachChat(body.messages, {
      context: body.context,
      onFinish: async () => {
        await consumeAiCredits(
          coach.organizationId,
          AI_CREDIT_COSTS.chat,
          coach.planTier,
        );
      },
    });

    return result.toUIMessageStreamResponse();
  },
);
