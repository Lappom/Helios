import type { OrgRole } from "./types";

export function getPostLoginPath(
  role: OrgRole | null,
  hasOrg: boolean,
): string {
  if (!hasOrg) {
    return "/sign-in";
  }

  if (role === "client") {
    return "/client";
  }

  return "/coach";
}
