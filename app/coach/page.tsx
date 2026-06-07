import Link from "next/link";
import { TrialBanner } from "@/components/billing/trial-banner";

export default function CoachDashboardPage() {
  return (
    <main className="min-h-screen bg-canvas px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <TrialBanner />
        <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
          Dashboard coach
        </h1>
        <p className="text-body-md text-muted">
          Placeholder P0.7 — navigation et KPIs à venir.
        </p>
        <Link
          href="/tarifs"
          className="text-sm font-semibold text-primary hover:text-primary/80"
        >
          Voir les tarifs
        </Link>
      </div>
    </main>
  );
}
