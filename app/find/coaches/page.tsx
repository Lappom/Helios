import { Suspense } from "react";
import { CoachDirectoryCard } from "@/components/find/coach-directory-card";
import { CoachDirectoryFilters } from "@/components/find/coach-directory-filters";
import {
  countPublicCoaches,
  listPublicCoaches,
} from "@/lib/coach-profile/service";
import { parseListPublicCoachesQuery } from "@/lib/validators/coach-profile";

export const metadata = {
  title: "Annuaire coaches — Helios Find",
  description:
    "Trouvez un coach sportif certifié près de chez vous ou en ligne.",
};

type CoachesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CoachesDirectoryPage({
  searchParams,
}: CoachesPageProps) {
  const params = await searchParams;
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      urlParams.set(key, value);
    }
  }

  const query = parseListPublicCoachesQuery(urlParams);
  const [{ items, total }, directoryCount] = await Promise.all([
    listPublicCoaches(query),
    countPublicCoaches(),
  ]);

  return (
    <>
      <section className="border-b border-hairline py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-caption-uppercase text-primary mb-4 tracking-widest">
            Helios Find
          </p>
          <h1 className="text-display-lg text-on-dark mb-4 font-bold tracking-tight">
            Trouvez votre coach
          </h1>
          <p className="text-body-md text-body mb-6 max-w-2xl">
            Parcourez l&apos;annuaire des coachs Helios. Filtrez par
            spécialité, localisation ou recherche libre.
          </p>
          <p className="text-stat-display text-primary font-bold">
            {directoryCount}+
          </p>
          <p className="text-body-sm text-muted">coachs dans l&apos;annuaire</p>
        </div>
      </section>

      <section className="py-section">
        <div className="mx-auto max-w-7xl space-y-10 px-6">
          <Suspense fallback={<div className="text-muted h-24 animate-pulse" />}>
            <CoachDirectoryFilters />
          </Suspense>

          {items.length > 0 ? (
            <>
              <p className="text-body-sm text-muted">
                {total} coach{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((coach, index) => (
                  <CoachDirectoryCard
                    key={coach.slug}
                    coach={coach}
                    index={index}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="border-hairline bg-surface-card rounded-lg border p-12 text-center">
              <p className="text-title-md text-on-dark mb-2 font-semibold">
                Aucun coach trouvé
              </p>
              <p className="text-body-sm text-muted">
                Essayez d&apos;élargir vos filtres ou revenez plus tard.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
