import { clerkClient } from "@clerk/nextjs/server";
import { problem } from "@/lib/api/response";
import { getClientOrThrow } from "./service";

// Requires a custom org role "client" in Clerk Dashboard (mapped as org:client).
const CLIENT_INVITE_ROLE = "org:client";

export async function inviteClientToPortal(
  organizationId: string,
  clerkOrgId: string,
  clientId: string,
) {
  const client = await getClientOrThrow(organizationId, clientId);

  if (client.clerkUserId) {
    throw problem({
      type: "validation-error",
      title: "Client already linked",
      status: 409,
      detail: "This client already has portal access.",
    });
  }

  const clerk = await clerkClient();

  try {
    const invitation =
      await clerk.organizations.createOrganizationInvitation({
        organizationId: clerkOrgId,
        emailAddress: client.email,
        role: CLIENT_INVITE_ROLE,
        publicMetadata: {
          heliosClientId: client.id,
        },
      });

    return {
      invitationId: invitation.id,
      email: client.email,
      status: invitation.status,
    };
  } catch (error) {
    throw problem({
      type: "internal-error",
      title: "Invitation failed",
      status: 500,
      detail:
        error instanceof Error
          ? error.message
          : "Unable to send client invitation.",
    });
  }
}

export function isClientClerkRole(role: string): boolean {
  const normalized = role.toLowerCase();
  return normalized === "org:client" || normalized === "client";
}
