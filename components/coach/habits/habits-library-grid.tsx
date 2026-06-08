"use client";

import { UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HabitListItem } from "@/lib/habits/types";

type HabitsLibraryGridProps = {
  habits: HabitListItem[];
  onAssign: (habit: HabitListItem) => void;
};

const FREQUENCY_LABELS = {
  daily: "Quotidien",
  weekly: "Hebdomadaire",
} as const;

export function HabitsLibraryGrid({ habits, onAssign }: HabitsLibraryGridProps) {
  if (habits.length === 0) {
    return (
      <div className="border-hairline bg-surface-card rounded-lg border p-8 text-center">
        <p className="text-muted text-sm">Aucune habitude trouvée.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {habits.map((habit) => (
        <article
          key={habit.id}
          className="border-hairline bg-surface-card group flex flex-col rounded-lg border p-6 transition-colors hover:border-hairline-strong"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <span className="text-4xl leading-none" aria-hidden>
              {habit.emoji}
            </span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {FREQUENCY_LABELS[habit.frequency]}
              </Badge>
              <Badge variant={habit.isPredefined ? "outline" : "default"}>
                {habit.isPredefined ? "Prédéfinie" : "Custom"}
              </Badge>
            </div>
          </div>

          <h3 className="text-title-md text-on-dark font-semibold">
            {habit.name}
          </h3>
          <p className="text-body-sm text-muted mt-2 min-h-[2.5rem] flex-1">
            {habit.message || "—"}
          </p>

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-caption text-muted">
              {habit.activeAssignmentCount} assignation
              {habit.activeAssignmentCount !== 1 ? "s" : ""} active
              {habit.activeAssignmentCount !== 1 ? "s" : ""}
            </p>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onAssign(habit)}
            >
              <UserPlus className="mr-1.5 size-4" />
              Assigner
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
