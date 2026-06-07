import type { teamMemberRoleEnum } from "@/lib/db/schema/enums";
import type { OrgRole } from "./types";

export type TeamMemberRole = (typeof teamMemberRoleEnum.enumValues)[number];

const CLERK_ROLE_MAP: Record<string, TeamMemberRole> = {
  "org:admin": "owner",
  "org:member": "coach",
  admin: "admin",
  assistant: "assistant",
  coach: "coach",
  owner: "owner",
};

const TEAM_ROLE_TO_ORG_ROLE: Record<TeamMemberRole, OrgRole> = {
  owner: "org_owner",
  admin: "org_admin",
  coach: "coach",
  assistant: "assistant",
};

export function mapClerkRoleToTeamMemberRole(clerkRole: string): TeamMemberRole {
  return CLERK_ROLE_MAP[clerkRole] ?? "coach";
}

export function mapTeamMemberRoleToOrgRole(role: TeamMemberRole): OrgRole {
  return TEAM_ROLE_TO_ORG_ROLE[role];
}

export function isOrgRole(
  role: OrgRole,
  allowed: OrgRole | OrgRole[],
): boolean {
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];
  return allowedRoles.includes(role);
}
