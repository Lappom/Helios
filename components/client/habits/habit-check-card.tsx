"use client";

import { cn } from "@/lib/utils";
import type { ClientHabitAssignment } from "@/lib/habits/types";

type HabitCheckCardProps = {
  habit: ClientHabitAssignment;
  loading: boolean;
  onToggle: (assignmentId: string, completed: boolean) => void;
};

export function HabitCheckCard({
  habit,
  loading,
  onToggle,
}: HabitCheckCardProps) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => onToggle(habit.assignmentId, !habit.todayCompleted)}
      className={cn(
        "border-hairline bg-surface-card flex w-full items-start gap-4 rounded-lg border p-5 text-left transition-all",
        habit.todayCompleted &&
          "border-accent-emerald ring-accent-emerald scale-[1.01] ring-1",
        loading && "opacity-60",
      )}
    >
      <span className="text-3xl leading-none" aria-hidden>
        {habit.emoji}
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-title-sm text-on-dark font-semibold">
            {habit.name}
          </h3>
          {habit.currentStreak > 0 ? (
            <span className="text-caption bg-surface-elevated text-primary rounded-full px-2 py-0.5 font-semibold">
              {habit.currentStreak}j streak
            </span>
          ) : null}
        </div>
        <p className="text-body-sm text-muted">{habit.message}</p>
      </div>

      <div
        className={cn(
          "mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          habit.todayCompleted
            ? "border-accent-emerald bg-accent-emerald text-on-dark"
            : "border-hairline-strong",
        )}
        aria-hidden
      >
        {habit.todayCompleted ? "✓" : ""}
      </div>
    </button>
  );
}
