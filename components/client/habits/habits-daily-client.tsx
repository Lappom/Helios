"use client";

import { useState } from "react";
import { toast } from "sonner";
import { HabitCheckCard } from "./habit-check-card";
import { HabitsStreakBanner } from "./habits-streak-banner";
import { logHabitApi } from "@/lib/habits/api-client";
import type { ClientHabitAssignment } from "@/lib/habits/types";

type HabitsDailyClientProps = {
  initialHabits: ClientHabitAssignment[];
};

export function HabitsDailyClient({ initialHabits }: HabitsDailyClientProps) {
  const [habits, setHabits] = useState(initialHabits);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleToggle(assignmentId: string, completed: boolean) {
    const previous = habits;
    setHabits((current) =>
      current.map((habit) =>
        habit.assignmentId === assignmentId
          ? { ...habit, todayCompleted: completed }
          : habit,
      ),
    );
    setLoadingId(assignmentId);

    try {
      await logHabitApi({ assignmentId, completed });
    } catch (error) {
      setHabits(previous);
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setLoadingId(null);
    }
  }

  if (habits.length === 0) {
    return (
      <div className="border-hairline bg-surface-card rounded-lg border p-8 text-center">
        <p className="text-muted text-sm">
          Aucune habitude assignée pour le moment. Votre coach vous en
          configurera bientôt.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HabitsStreakBanner habits={habits} />

      <div className="space-y-3">
        {habits.map((habit) => (
          <HabitCheckCard
            key={habit.assignmentId}
            habit={habit}
            loading={loadingId === habit.assignmentId}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}
