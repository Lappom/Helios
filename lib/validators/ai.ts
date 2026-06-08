import { z } from "zod";

export const aiChatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().trim().min(1).max(8000),
});

export const aiChatSchema = z.object({
  messages: z.array(aiChatMessageSchema).min(1).max(50),
  context: z.enum(["programs", "general"]).optional().default("general"),
});

export const aiGenerateProgramSchema = z.object({
  prompt: z.string().trim().min(10).max(4000),
  clientId: z.string().min(1).optional(),
  durationWeeks: z.number().int().min(1).max(12).optional(),
});

export type AiChatInput = z.infer<typeof aiChatSchema>;
export type AiGenerateProgramInput = z.infer<typeof aiGenerateProgramSchema>;
