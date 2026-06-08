import { requireRole } from "@/lib/auth/org-context";
import type { OrgContext, OrgRole } from "@/lib/auth/types";

const COACH_WRITE_ROLES: OrgRole[] = ["org_owner", "org_admin", "coach"];
const COACH_READ_ROLES: OrgRole[] = [
  "org_owner",
  "org_admin",
  "coach",
  "assistant",
];

export async function requireCoachWrite(): Promise<OrgContext> {
  return requireRole(...COACH_WRITE_ROLES);
}

export async function requireCoachRead(): Promise<OrgContext> {
  return requireRole(...COACH_READ_ROLES);
}
