import { Badge } from "@/components/ui/badge";
import type { SessionScheduleStatus } from "@/lib/sessions/types";
import { cn } from "@/lib/utils";

const LABELS: Record<SessionScheduleStatus, string> = {
  planned: "À faire",
  in_progress: "En cours",
  completed: "Fait",
};

const STYLES: Record<SessionScheduleStatus, string> = {
  planned: "bg-surface-elevated text-muted",
  in_progress: "bg-primary/20 text-primary",
  completed: "bg-accent-emerald/20 text-accent-emerald",
};

type SessionStatusBadgeProps = {
  status: SessionScheduleStatus;
  className?: string;
};

export function SessionStatusBadge({
  status,
  className,
}: SessionStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("rounded-md border-0 font-medium", STYLES[status], className)}
    >
      {LABELS[status]}
    </Badge>
  );
}
