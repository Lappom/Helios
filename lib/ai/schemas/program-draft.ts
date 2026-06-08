import { z } from "zod";
import { blockTypeSchema } from "@/lib/validators/programs";

const prescriptionDraftSchema = z.object({
  setNumber: z.number().int().min(1).max(50),
  load: z.string().trim().max(50).nullable().optional(),
  reps: z.string().trim().max(50).nullable().optional(),
  restSeconds: z.number().int().min(0).max(3600).nullable().optional(),
  tempo: z.string().trim().max(20).nullable().optional(),
  rpe: z.number().min(1).max(10).nullable().optional(),
  durationSeconds: z.number().int().min(1).max(86400).nullable().optional(),
});

const blockExerciseDraftSchema = z.object({
  exerciseQuery: z.string().trim().min(1).max(200),
  notes: z.string().trim().max(2000).nullable().optional(),
  prescriptions: z.array(prescriptionDraftSchema).min(1).max(50),
});

const blockDraftSchema = z.object({
  type: blockTypeSchema.default("single"),
  sharedRestSeconds: z.number().int().min(0).max(3600).nullable().optional(),
  rounds: z.number().int().min(1).max(100).nullable().optional(),
  restBetweenRoundsSeconds: z
    .number()
    .int()
    .min(0)
    .max(3600)
    .nullable()
    .optional(),
  durationSeconds: z.number().int().min(1).max(86400).nullable().optional(),
  targetRpe: z.number().min(1).max(10).nullable().optional(),
  exercises: z.array(blockExerciseDraftSchema).min(1).max(10),
});

const sessionDraftSchema = z.object({
  name: z.string().trim().min(1).max(200),
  dayOfWeek: z.number().int().min(0).max(6).nullable().optional(),
  blocks: z.array(blockDraftSchema).min(1).max(50),
});

const weekDraftSchema = z.object({
  label: z.string().trim().min(1).max(100),
  sessions: z.array(sessionDraftSchema).min(1).max(14),
});

export const programDraftSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).nullable().optional(),
  weeks: z.array(weekDraftSchema).min(1).max(52),
});

export type ProgramDraft = z.infer<typeof programDraftSchema>;
export type ResolvedExerciseDraft = {
  exerciseId: string;
  exerciseName: string;
  notes: string | null;
  prescriptions: z.infer<typeof prescriptionDraftSchema>[];
};

export type ResolvedBlockDraft = {
  type: z.infer<typeof blockTypeSchema>;
  sharedRestSeconds: number | null;
  rounds: number | null;
  restBetweenRoundsSeconds: number | null;
  durationSeconds: number | null;
  targetRpe: number | null;
  exercises: ResolvedExerciseDraft[];
};

export type ResolvedProgramDraft = {
  name: string;
  description: string | null;
  weeks: Array<{
    label: string;
    sessions: Array<{
      name: string;
      dayOfWeek: number | null;
      blocks: ResolvedBlockDraft[];
    }>;
  }>;
  unresolvedExercises: string[];
};
