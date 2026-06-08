import type { QuotaCheckResult } from "@/lib/billing/access";

export function ClientsQuotaBar({ quota }: { quota: QuotaCheckResult }) {
  const limitLabel =
    quota.limit === Number.POSITIVE_INFINITY ? "∞" : String(quota.limit);
  const percent =
    quota.limit === Number.POSITIVE_INFINITY
      ? 0
      : Math.min(100, Math.round((quota.used / quota.limit) * 100));

  return (
    <div className="border-hairline bg-surface-card rounded-lg border p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-caption-uppercase text-muted tracking-widest uppercase">
            Quota clients actifs
          </p>
          <p className="text-display-sm text-primary mt-1 font-bold tracking-tight">
            {quota.used}
            <span className="text-body-md text-muted ml-1 font-normal">
              / {limitLabel}
            </span>
          </p>
        </div>
        <p className="text-body-sm text-muted">
          {quota.remaining === Number.POSITIVE_INFINITY
            ? "Illimité sur votre plan"
            : `${quota.remaining} place${quota.remaining === 1 ? "" : "s"} restante${quota.remaining === 1 ? "" : "s"}`}
        </p>
      </div>
      {quota.limit !== Number.POSITIVE_INFINITY ? (
        <div className="bg-surface-elevated mt-4 h-2 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
