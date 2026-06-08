import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PublicCoachListItem } from "@/lib/coach-profile/service";

type CoachDirectoryCardProps = {
  coach: PublicCoachListItem;
  index?: number;
  className?: string;
};

export function CoachDirectoryCard({
  coach,
  index = 0,
  className,
}: CoachDirectoryCardProps) {
  return (
    <Link
      href={`/find/coaches/${coach.slug}`}
      className={cn(
        "border-hairline bg-surface-card group block rounded-lg border p-6 transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/30",
        "animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500",
        className,
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="mb-4 flex items-start gap-4">
        <div className="border-hairline bg-surface-elevated relative size-16 shrink-0 overflow-hidden rounded-full border">
          {coach.photoUrl ? (
            <Image
              src={coach.photoUrl}
              alt={coach.displayName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-muted flex size-full items-center justify-center text-lg font-bold">
              {coach.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-title-md text-on-dark group-hover:text-primary font-semibold transition-colors">
            {coach.displayName}
          </h3>
          {coach.location ? (
            <p className="text-body-sm text-muted mt-1">{coach.location}</p>
          ) : null}
        </div>
      </div>

      {coach.bio ? (
        <p className="text-body-sm text-body line-clamp-2">{coach.bio}</p>
      ) : null}

      {coach.specialties.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {coach.specialties.slice(0, 3).map((specialty) => (
            <Badge
              key={specialty}
              variant="secondary"
              className="bg-surface-elevated text-muted border-hairline"
            >
              {specialty}
            </Badge>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
