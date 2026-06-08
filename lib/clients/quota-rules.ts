import type { ClientStatus } from "@/lib/validators/clients";

export const QUOTA_STATUSES: ClientStatus[] = ["ACTIVE", "TRIAL"];

export function countsTowardQuota(status: ClientStatus): boolean {
  return QUOTA_STATUSES.includes(status);
}

export function quotaDelta(from: ClientStatus, to: ClientStatus): number {
  const fromCounts = countsTowardQuota(from);
  const toCounts = countsTowardQuota(to);

  if (fromCounts === toCounts) {
    return 0;
  }

  if (!fromCounts && toCounts) {
    return 1;
  }

  if (fromCounts && !toCounts) {
    return -1;
  }

  return 0;
}
