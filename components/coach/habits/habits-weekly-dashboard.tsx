"use client";

import { cn } from "@/lib/utils";
import type { OrgWeeklyHabitSummary } from "@/lib/habits/types";

type HabitsWeeklyDashboardProps = {
  summary: OrgWeeklyHabitSummary;
};

export function HabitsWeeklyDashboard({ summary }: HabitsWeeklyDashboardProps) {
  return (
    <aside className="border-hairline bg-surface-card space-y-6 rounded-lg border p-6">
      <div>
        <p className="text-caption-uppercase text-muted tracking-widest uppercase">
          7 derniers jours
        </p>
        <p className="text-stat-display text-primary mt-2 font-bold">
          {summary.averageCompletionRate}%
        </p>
        <p className="text-body-sm text-muted mt-1">
          Taux moyen · {summary.activeAssignments} assignation
          {summary.activeAssignments !== 1 ? "s" : ""} active
          {summary.activeAssignments !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {summary.weeklyBreakdown.map((day) => {
          const date = new Date(`${day.date}T00:00:00.000Z`);
          const weekday = date.toLocaleDateString("fr-FR", {
            weekday: "narrow",
            timeZone: "UTC",
          });

          return (
            <div key={day.date} className="space-y-1.5 text-center">
              <div
                className={cn(
                  "bg-surface-elevated flex h-12 items-end justify-center rounded-md p-1",
                  day.completionRate >= 80 && "ring-accent-emerald ring-1",
                )}
                title={`${day.date} · ${day.completionRate}%`}
              >
                <div
                  className="bg-primary w-full rounded-sm transition-all"
                  style={{
                    height: `${Math.max(day.completionRate, 4)}%`,
                    opacity: day.expectedCount === 0 ? 0.15 : 1,
                  }}
                />
              </div>
              <span className="text-caption text-muted uppercase">{weekday}</span>
            </div>
          );
        })}
      </div>

      <p className="text-caption text-muted">
        Heatmap basée sur les habitudes actives de l&apos;organisation.
      </p>
    </aside>
  );
}
