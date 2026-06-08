"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchClientHabitStats } from "@/lib/habits/api-client";
import type { ClientHabitStatsReport } from "@/lib/habits/types";

type ClientHabitsCardProps = {
  clientId: string;
};

export function ClientHabitsCard({ clientId }: ClientHabitsCardProps) {
  return <ClientHabitsCardContent key={clientId} clientId={clientId} />;
}

function ClientHabitsCardContent({ clientId }: ClientHabitsCardProps) {
  const [stats, setStats] = useState<ClientHabitStatsReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchClientHabitStats(clientId)
      .then((data) => {
        if (!cancelled) {
          setStats(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStats(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  const activeAssignments = stats?.assignments ?? [];

  return (
    <section className="border-hairline bg-surface-card space-y-4 rounded-lg border p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-title-lg text-on-dark font-bold">Habitudes</h2>
        <Link
          href="/coach/habits"
          className="text-primary text-sm font-medium hover:underline"
        >
          Bibliothèque
        </Link>
      </div>

      {loading ? (
        <p className="text-muted text-sm">Chargement…</p>
      ) : activeAssignments.length === 0 ? (
        <div className="space-y-3">
          <p className="text-muted text-sm">
            Aucune habitude active pour ce client.
          </p>
          <Button asChild size="sm" variant="secondary">
            <Link href="/coach/habits">Assigner depuis la bibliothèque</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <p className="text-stat-display text-primary font-bold">
              {stats?.averageCompletionRate ?? 0}%
            </p>
            <p className="text-body-sm text-muted pb-1">
              complétion moyenne · {activeAssignments.length} habitude
              {activeAssignments.length !== 1 ? "s" : ""}
            </p>
          </div>

          <ul className="space-y-2">
            {activeAssignments.slice(0, 4).map((assignment) => (
              <li
                key={assignment.assignmentId}
                className="border-hairline bg-surface-elevated flex items-center justify-between gap-3 rounded-md border px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{assignment.emoji}</span>
                  <span className="text-on-dark text-sm font-medium">
                    {assignment.habitName}
                  </span>
                </div>
                <span className="text-primary text-sm font-semibold">
                  {assignment.currentStreak}j streak
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
