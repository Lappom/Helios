import { gateway } from "@ai-sdk/gateway";

/** Non-thinking chat default — maps to DeepSeek-V3.2 (deepseek-chat). */
export const DEFAULT_AI_CHAT_MODEL =
  process.env.AI_CHAT_MODEL ??
  process.env.AI_DEFAULT_MODEL ??
  "deepseek/deepseek-v3.2";

/** Agentic / tool-calling default for program generation. */
export const DEFAULT_AI_GENERATE_MODEL =
  process.env.AI_GENERATE_MODEL ??
  process.env.AI_DEFAULT_MODEL ??
  "deepseek/deepseek-v4-pro";

export function getAiChatModel(modelId = DEFAULT_AI_CHAT_MODEL) {
  return gateway(modelId);
}

export function getAiGenerateModel(modelId = DEFAULT_AI_GENERATE_MODEL) {
  return gateway(modelId);
}
