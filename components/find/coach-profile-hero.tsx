import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PublicCoachDto } from "@/lib/coach-profile/service";

type CoachProfileHeroProps = {
  coach: PublicCoachDto;
  className?: string;
};

export function CoachProfileHero({ coach, className }: CoachProfileHeroProps) {
  const socialEntries = [
    { key: "website", label: "Site web", href: coach.socialLinks.website },
    { key: "instagram", label: "Instagram", href: coach.socialLinks.instagram },
    { key: "youtube", label: "YouTube", href: coach.socialLinks.youtube },
  ].filter((entry) => entry.href);

  return (
    <section className={cn("py-section bg-canvas", className)}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {coach.location ? (
            <p className="text-caption-uppercase text-primary mb-4 tracking-widest">
              {coach.location}
            </p>
          ) : null}
          <h1 className="text-display-lg text-on-dark mb-6 font-bold tracking-tight">
            {coach.displayName}
          </h1>
          {coach.bio ? (
            <p className="text-body-md text-body mb-8 max-w-xl">{coach.bio}</p>
          ) : null}

          {coach.specialties.length > 0 ? (
            <div className="mb-8 flex flex-wrap gap-2">
              {coach.specialties.map((specialty) => (
                <Badge
                  key={specialty}
                  className="bg-surface-card text-on-dark border-hairline"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          ) : null}

          {coach.languages.length > 0 ? (
            <p className="text-body-sm text-muted mb-6">
              Langues : {coach.languages.join(", ")}
            </p>
          ) : null}

          {socialEntries.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {socialEntries.map((entry) => (
                <Link
                  key={entry.key}
                  href={entry.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-primary font-medium hover:underline"
                >
                  {entry.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-5">
          <div className="border-hairline bg-surface-card overflow-hidden rounded-lg border p-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
              {coach.photoUrl ? (
                <Image
                  src={coach.photoUrl}
                  alt={coach.displayName}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="bg-surface-elevated text-muted flex size-full items-center justify-center text-6xl font-bold">
                  {coach.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
