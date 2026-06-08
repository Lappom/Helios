"use client";

import { ExerciseCard } from "@/components/coach/exercises/exercise-card";
import type { ExerciseListItem } from "@/lib/exercises/types";

type ExerciseGridProps = {
  items: ExerciseListItem[];
  loading: boolean;
  onSelect: (exercise: ExerciseListItem) => void;
  onFavoriteToggle: (exercise: ExerciseListItem) => void;
};

function ExerciseSkeleton() {
  return (
    <div className="border-hairline bg-surface-card animate-pulse overflow-hidden rounded-lg border">
      <div className="bg-surface-elevated aspect-[4/3]" />
      <div className="space-y-3 p-4">
        <div className="bg-surface-elevated h-5 w-2/3 rounded" />
        <div className="bg-surface-elevated h-4 w-full rounded" />
      </div>
    </div>
  );
}

export function ExerciseGrid({
  items,
  loading,
  onSelect,
  onFavoriteToggle,
}: ExerciseGridProps) {
  if (!loading && items.length === 0) {
    return (
      <div className="border-hairline bg-surface-card text-muted rounded-lg border p-10 text-center">
        <p className="text-title-sm text-on-dark font-semibold">
          Aucun exercice trouvé
        </p>
        <p className="text-body-md mt-2">
          Ajustez vos filtres ou créez un exercice custom.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {loading
        ? Array.from({ length: 8 }).map((_, index) => (
            <ExerciseSkeleton key={`skeleton-${index}`} />
          ))
        : items.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={index}
              onSelect={onSelect}
              onFavoriteToggle={onFavoriteToggle}
            />
          ))}
    </div>
  );
}
