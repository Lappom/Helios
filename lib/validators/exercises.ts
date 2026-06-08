import { z } from "zod";

export const EXERCISE_TYPES = [
  "strength",
  "cardio",
  "mobility",
  "plyometric",
] as const;

export const EXERCISE_SOURCES = ["system", "custom"] as const;

export type ExerciseType = (typeof EXERCISE_TYPES)[number];
export type ExerciseSource = (typeof EXERCISE_SOURCES)[number];

export const MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "forearms",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "core",
  "abs",
  "obliques",
  "traps",
  "lats",
  "hip_flexors",
  "adductors",
  "abductors",
  "full_body",
] as const;

export const EQUIPMENT_TYPES = [
  "barbell",
  "dumbbell",
  "kettlebell",
  "machine",
  "cable",
  "bodyweight",
  "resistance_band",
  "medicine_ball",
  "smith_machine",
  "trap_bar",
  "pull_up_bar",
  "bench",
  "ez_bar",
  "suspension_trainer",
  "other",
] as const;

export const ALLOWED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
] as const;

export const exerciseTypeSchema = z.enum(EXERCISE_TYPES);
export const exerciseSourceSchema = z.enum(EXERCISE_SOURCES);

export const exerciseMediaSchema = z.object({
  thumbnailUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  animationUrl: z.string().url().optional(),
  videoType: z.enum(["youtube", "blob"]).optional(),
});

export const createExerciseSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
  instructions: z.string().trim().max(10000).optional(),
  muscleGroups: z
    .array(z.enum(MUSCLE_GROUPS))
    .min(1)
    .max(10),
  equipment: z.array(z.enum(EQUIPMENT_TYPES)).min(1).max(10),
  type: exerciseTypeSchema.default("strength"),
  categoryId: z.string().min(1).optional(),
  media: exerciseMediaSchema.optional().default({}),
});

export const updateExerciseSchema = createExerciseSchema.partial();

export const setExerciseAliasSchema = z.object({
  alias: z.string().trim().min(1).max(200),
});

export const hideExerciseSchema = z.object({
  hidden: z.boolean(),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
export type SetExerciseAliasInput = z.infer<typeof setExerciseAliasSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export type ListExercisesQuery = {
  search?: string;
  muscle?: string;
  equipment?: string;
  type?: ExerciseType;
  source?: ExerciseSource;
  categoryId?: string;
  favorite?: boolean;
  page: number;
  limit: number;
  offset: number;
};

export function parseListExercisesQuery(
  searchParams: URLSearchParams,
  pagination: { page: number; limit: number; offset: number },
): ListExercisesQuery {
  const typeParam = searchParams.get("type");
  const typeResult = typeParam
    ? exerciseTypeSchema.safeParse(typeParam.toLowerCase())
    : null;

  const sourceParam = searchParams.get("source");
  const sourceResult = sourceParam
    ? exerciseSourceSchema.safeParse(sourceParam.toLowerCase())
    : null;

  const favoriteParam = searchParams.get("favorite");
  let favorite: boolean | undefined;
  if (favoriteParam === "true") favorite = true;
  if (favoriteParam === "false") favorite = false;

  return {
    search: searchParams.get("search")?.trim() || undefined,
    muscle: searchParams.get("muscle")?.trim() || undefined,
    equipment: searchParams.get("equipment")?.trim() || undefined,
    type: typeResult?.success ? typeResult.data : undefined,
    source: sourceResult?.success ? sourceResult.data : undefined,
    categoryId: searchParams.get("categoryId") ?? undefined,
    favorite,
    page: pagination.page,
    limit: pagination.limit,
    offset: pagination.offset,
  };
}
