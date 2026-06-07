import { PricingTable } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk/appearance";

export default function TarifsPage() {
  return (
    <main className="px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="text-display-md text-on-dark font-bold tracking-tight">
            Tarifs
          </h1>
          <p className="text-body-md text-muted mx-auto max-w-2xl">
            Choisissez le plan adapté à votre activité de coaching. Essai
            gratuit 14 jours, sans carte bancaire.
          </p>
        </div>
        <div className="flex justify-center">
          <PricingTable
            for="organization"
            appearance={clerkAppearance}
          />
        </div>
      </div>
    </main>
  );
}
