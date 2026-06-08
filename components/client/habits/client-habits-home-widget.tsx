"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ClientHabitsSummary } from "@/lib/habits/types";

type ClientHabitsHomeWidgetProps = {
  summary: ClientHabitsSummary;
};

export function ClientHabitsHomeWidget({ summary }: ClientHabitsHomeWidgetProps) {
  if (summary.totalToday === 0) {
    return null;
  }

  return (
    <section className="border-hairline bg-surface-card flex flex-col gap-4 rounded-lg border p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="bg-surface-elevated text-primary flex size-10 items-center justify-center rounded-md">
          <Flame className="size-5" />
        </div>
        <div>
          <p className="text-title-sm text-on-dark font-semibold">
            Habitudes du jour
          </p>
          <p className="text-body-sm text-muted mt-1">
            {summary.remainingToday === 0
              ? "Bravo, toutes vos habitudes sont cochées !"
              : `${summary.remainingToday} habitude${summary.remainingToday !== 1 ? "s" : ""} restante${summary.remainingToday !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>
      <Button asChild variant="secondary" size="sm">
        <Link href="/client/habits">Cocher mes habitudes</Link>
      </Button>
    </section>
  );
}
