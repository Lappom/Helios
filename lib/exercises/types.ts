import type { ExerciseMedia } from "@/lib/db/schema/exercises";

export function buildExerciseSearchVector(
  name: string,
  muscleGroups: string[],
  equipment: string[],
): string {
  return [name, ...muscleGroups, ...equipment]
    .join(" ")
    .trim()
    .toLowerCase();
}

export function slugifyExerciseName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export type ExerciseListItem = {
  id: string;
  name: string;
  alias: string | null;
  description: string | null;
  instructions: string | null;
  muscleGroups: string[];
  equipment: string[];
  type: "strength" | "cardio" | "mobility" | "plyometric";
  source: "system" | "custom";
  media: ExerciseMedia;
  categoryId: string | null;
  categoryName: string | null;
  isFavorite: boolean;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ExerciseCategoryItem = {
  id: string;
  name: string;
  createdAt: Date;
};
