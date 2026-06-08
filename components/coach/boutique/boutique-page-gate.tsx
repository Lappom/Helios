"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeatureGate } from "@/components/billing/feature-gate";
import { BoutiquePageClient } from "./boutique-page-client";
import type { CoachServiceDto } from "@/lib/coach-profile/service";
import type { PromoCodeDto } from "@/lib/promo-codes/service";
import type { ProgramListItem } from "@/lib/programs/types";

type BoutiquePageGateProps = {
  initialServices: CoachServiceDto[];
  initialPromoCodes: PromoCodeDto[];
  programs: ProgramListItem[];
};

function UpgradeFallback() {
  return (
    <div className="border-hairline bg-surface-card space-y-4 rounded-lg border p-8 text-center">
      <p className="text-title-md text-on-dark font-semibold">
        Boutique en ligne — Pro+
      </p>
      <p className="text-body-sm text-muted mx-auto max-w-md">
        Vendez vos prestations, gérez les codes promo et automatisez
        l&apos;onboarding client avec un plan Pro ou supérieur.
      </p>
      <Button asChild>
        <Link href="/tarifs">Voir les plans</Link>
      </Button>
    </div>
  );
}

export function BoutiquePageGate(props: BoutiquePageGateProps) {
  return (
    <FeatureGate feature="shop" fallback={<UpgradeFallback />}>
      <BoutiquePageClient {...props} />
    </FeatureGate>
  );
}
