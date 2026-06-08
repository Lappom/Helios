import { notFound } from "next/navigation";
import { ClientDetailClient } from "@/components/coach/clients/client-detail-client";
import { requireRole } from "@/lib/auth/org-context";
import { getClientDetail } from "@/lib/clients/service";
import { ApiProblemError } from "@/lib/api/response";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CoachClientDetailPage({ params }: PageProps) {
  const org = await requireRole(
    "org_owner",
    "org_admin",
    "coach",
    "assistant",
  );
  const { id } = await params;

  let client;

  try {
    client = await getClientDetail(org.organizationId, id);
  } catch (error) {
    if (error instanceof ApiProblemError && error.problem.status === 404) {
      notFound();
    }
    throw error;
  }

  return <ClientDetailClient initialClient={client} />;
}
