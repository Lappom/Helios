import { notFound } from "next/navigation";
import { PathwayEditorClient } from "@/components/coach/pathways/pathway-editor-client";
import { requireRole } from "@/lib/auth/org-context";
import { getPathwayTree } from "@/lib/pathways/service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CoachPathwayEditPage({ params }: PageProps) {
  const org = await requireRole("org_owner", "org_admin", "coach", "assistant");
  const { id } = await params;

  let pathway;
  try {
    pathway = await getPathwayTree(org.organizationId, id);
  } catch {
    notFound();
  }

  return <PathwayEditorClient initialPathway={pathway} />;
}
