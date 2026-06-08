"use client";

import type { ClientHabitAssignment } from "@/lib/habits/types";

type HabitsStreakBannerProps = {
  habits: ClientHabitAssignment[];
};

export function HabitsStreakBanner({ habits }: HabitsStreakBannerProps) {
  const bestStreak = habits.reduce(
    (max, habit) => Math.max(max, habit.currentStreak),
    0,
  );
  const completedToday = habits.filter((habit) => habit.todayCompleted).length;

  if (habits.length === 0) {
    return null;
  }

  return (
    <section className="border-hairline bg-surface-card grid gap-4 rounded-lg border p-6 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="text-caption-uppercase text-primary tracking-widest uppercase">
          Aujourd&apos;hui
        </p>
        <p className="text-body-md text-muted mt-1">
          {completedToday}/{habits.length} habitudes complétées
        </p>
      </div>
      <div className="text-right">
        <p className="text-stat-display text-primary font-bold">{bestStreak}</p>
        <p className="text-caption text-muted">Meilleur streak (jours)</p>
      </div>
    </section>
  );
}
