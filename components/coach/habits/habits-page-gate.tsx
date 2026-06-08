"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeatureGate } from "@/components/billing/feature-gate";
import { HabitsPageClient } from "./habits-page-client";
import type { HabitListItem, OrgWeeklyHabitSummary } from "@/lib/habits/types";

type HabitsPageGateProps = {
  initialHabits: HabitListItem[];
  weeklySummary: OrgWeeklyHabitSummary;
};

function UpgradeFallback() {
  return (
    <div className="border-hairline bg-surface-card space-y-4 rounded-lg border p-8 text-center">
      <p className="text-title-md text-on-dark font-semibold">
        Suivi d&apos;habitudes — Pro+
      </p>
      <p className="text-body-sm text-muted mx-auto max-w-md">
        Assignez des habitudes saines à vos clients, suivez leurs streaks et
        leur taux de complétion avec un plan Pro ou supérieur.
      </p>
      <Button asChild>
        <Link href="/tarifs">Voir les plans</Link>
      </Button>
    </div>
  );
}

export function HabitsPageGate(props: HabitsPageGateProps) {
  return (
    <FeatureGate feature="habits" fallback={<UpgradeFallback />}>
      <HabitsPageClient {...props} />
    </FeatureGate>
  );
}
