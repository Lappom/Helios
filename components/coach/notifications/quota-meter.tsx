import type { QuotaCheckResult } from "@/lib/billing/access";
import { cn } from "@/lib/utils";

type QuotaMeterProps = {
  quota: QuotaCheckResult;
};

export function QuotaMeter({ quota }: QuotaMeterProps) {
  const isUnlimited = quota.limit === Number.POSITIVE_INFINITY;
  const ratio = isUnlimited ? 0 : quota.used / quota.limit;
  const isNearLimit = !isUnlimited && ratio >= 0.85;
  const isExceeded = !isUnlimited && quota.used >= quota.limit;

  return (
    <div
      className={cn(
        "border-hairline bg-surface-card rounded-lg border p-5",
        isExceeded && "border-accent-rose/50",
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-caption-uppercase text-muted tracking-widest uppercase">
            Quota mensuel
          </p>
          <p className="text-on-dark text-title-md mt-1 font-semibold">
            {isUnlimited
              ? "Illimité"
              : `${quota.used} / ${quota.limit} notifications`}
          </p>
        </div>
        {!isUnlimited ? (
          <p
            className={cn(
              "text-body-sm font-medium",
              isExceeded
                ? "text-accent-rose"
                : isNearLimit
                  ? "text-primary"
                  : "text-muted",
            )}
          >
            {quota.remaining} restantes
          </p>
        ) : null}
      </div>
      {!isUnlimited ? (
        <div className="bg-surface-elevated mt-4 h-2 overflow-hidden rounded-full">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              isExceeded
                ? "bg-accent-rose"
                : isNearLimit
                  ? "bg-primary"
                  : "bg-accent-emerald",
            )}
            style={{ width: `${Math.min(100, ratio * 100)}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
