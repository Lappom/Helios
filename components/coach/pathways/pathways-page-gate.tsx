"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeatureGate } from "@/components/billing/feature-gate";
import { PathwaysListClient } from "./pathways-list-client";
import type { PathwayListItem } from "@/lib/pathways/types";

type PathwaysPageGateProps = {
  initialPathways?: PathwayListItem[];
  children?: React.ReactNode;
};

function UpgradeFallback() {
  return (
    <div className="border-hairline bg-surface-card space-y-4 rounded-lg border p-8 text-center">
      <p className="text-title-md text-on-dark font-semibold">
        Parcours coaching — Pro+
      </p>
      <p className="text-body-sm text-muted mx-auto max-w-md">
        Construisez des parcours multi-étapes avec délais : assignation de
        programme, bilans et messages automatiques à chaque nouveau client.
      </p>
      <Button asChild>
        <Link href="/tarifs">Voir les plans</Link>
      </Button>
    </div>
  );
}

export function PathwaysPageGate({
  initialPathways = [],
  children,
}: PathwaysPageGateProps) {
  return (
    <FeatureGate feature="coaching_journeys" fallback={<UpgradeFallback />}>
      {children ?? <PathwaysListClient initialPathways={initialPathways} />}
    </FeatureGate>
  );
}
