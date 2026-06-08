"use client";

import { Star } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  labelEquipment,
  labelExerciseType,
  labelMuscle,
} from "@/lib/exercises/constants";
import type { ExerciseListItem } from "@/lib/exercises/types";
import { cn } from "@/lib/utils";

type ExerciseCardProps = {
  exercise: ExerciseListItem;
  index: number;
  onSelect: (exercise: ExerciseListItem) => void;
  onFavoriteToggle: (exercise: ExerciseListItem) => void;
};

export function ExerciseCard({
  exercise,
  index,
  onSelect,
  onFavoriteToggle,
}: ExerciseCardProps) {
  async function handleFavorite(event: React.MouseEvent) {
    event.stopPropagation();
    const response = await fetch(`/api/v1/exercises/${exercise.id}/favorite`, {
      method: "POST",
    });
    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.detail ?? "Impossible de modifier le favori.");
      return;
    }
    onFavoriteToggle({ ...exercise, isFavorite: payload.isFavorite });
  }

  return (
    <article
      className={cn(
        "group border-hairline bg-surface-card hover:border-hairline-strong cursor-pointer overflow-hidden rounded-lg border transition-colors",
        "animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards duration-500",
      )}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
      onClick={() => onSelect(exercise)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(exercise);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="bg-surface-elevated relative aspect-[4/3] overflow-hidden">
        {exercise.media.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={exercise.media.thumbnailUrl}
            alt={exercise.name}
            className="size-full object-cover"
          />
        ) : (
          <div className="from-surface-elevated to-surface-card flex size-full items-end bg-gradient-to-br p-4">
            <span className="text-caption-uppercase text-muted">
              {labelExerciseType(exercise.type)}
            </span>
          </div>
        )}
        <button
          type="button"
          aria-label={exercise.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={handleFavorite}
          className="border-hairline bg-surface-card/90 absolute top-3 right-3 rounded-md border p-2"
        >
          <Star
            className={cn(
              "size-4",
              exercise.isFavorite ? "fill-primary text-primary" : "text-muted",
            )}
          />
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-title-sm text-on-dark font-semibold">
              {exercise.name}
            </h3>
            <p className="text-body-sm text-muted mt-1 line-clamp-2">
              {exercise.description ?? "Exercice de coaching."}
            </p>
          </div>
          <Badge variant="outline" className="border-hairline shrink-0">
            {exercise.source === "system" ? "SYS" : "CUSTOM"}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {exercise.muscleGroups.slice(0, 2).map((muscle) => (
            <span
              key={muscle}
              className="text-caption-uppercase text-muted border-hairline rounded-sm border px-2 py-0.5"
            >
              {labelMuscle(muscle)}
            </span>
          ))}
          {exercise.equipment.slice(0, 1).map((item) => (
            <span
              key={item}
              className="text-caption-uppercase text-primary border-hairline rounded-sm border px-2 py-0.5"
            >
              {labelEquipment(item)}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
