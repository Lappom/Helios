import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SessionExecutionClient } from "@/components/client/session/session-execution-client";
import { getOrgContext } from "@/lib/auth/org-context";
import { getClientIdForUser } from "@/lib/api/require-client";
import { getSessionExecutionDetail } from "@/lib/sessions/service";

type SessionPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ scheduledDate?: string }>;
};

export default async function ClientSessionPage({
  params,
  searchParams,
}: SessionPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const org = await getOrgContext();
  if (!org || org.role !== "client") {
    redirect("/coach");
  }

  const clientId = await getClientIdForUser(org.organizationId, userId);
  if (!clientId) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const { scheduledDate } = await searchParams;

  if (!scheduledDate) {
    redirect("/client");
  }

  const detail = await getSessionExecutionDetail(
    org.organizationId,
    clientId,
    id,
    scheduledDate,
  );

  return (
    <SessionExecutionClient
      initialDetail={detail}
      scheduledDateKey={scheduledDate}
    />
  );
}
