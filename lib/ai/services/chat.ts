import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getAiChatModel } from "@/lib/ai/gateway";
import { COACH_CHAT_SYSTEM_PROMPT } from "@/lib/ai/prompts/generate-program";

export async function streamCoachChat(
  messages: UIMessage[],
  options?: {
    context?: string;
    onFinish?: () => void | Promise<void>;
  },
) {
  const system =
    options?.context === "programs"
      ? `${COACH_CHAT_SYSTEM_PROMPT}\nContexte actuel : édition de programmes d'entraînement.`
      : COACH_CHAT_SYSTEM_PROMPT;

  return streamText({
    model: getAiChatModel(),
    system,
    messages: await convertToModelMessages(messages),
    onFinish: options?.onFinish,
  });
}
