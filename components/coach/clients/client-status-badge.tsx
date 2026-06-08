import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ClientStatus } from "@/lib/validators/clients";
import { CLIENT_STATUS_LABELS } from "@/lib/clients/constants";

const statusStyles: Record<ClientStatus, string> = {
  PROSPECT: "border-hairline bg-surface-elevated text-muted",
  TRIAL: "border-hairline bg-surface-elevated text-body",
  ACTIVE: "border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald",
  PAUSED: "border-hairline bg-surface-elevated text-body-strong",
  CHURNED: "border-accent-rose/30 bg-accent-rose/10 text-accent-rose",
};

export function ClientStatusBadge({
  status,
  className,
}: {
  status: ClientStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-md border", statusStyles[status], className)}
    >
      {CLIENT_STATUS_LABELS[status]}
    </Badge>
  );
}
