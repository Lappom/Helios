import { notFound } from "next/navigation";
import { AssessmentTemplateEditorClient } from "@/components/coach/assessments/assessment-template-editor-client";
import { requireRole } from "@/lib/auth/org-context";
import { getAssessmentTemplateTree } from "@/lib/assessments/service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AssessmentTemplateEditPage({ params }: PageProps) {
  const org = await requireRole("org_owner", "org_admin", "coach", "assistant");
  const { id } = await params;

  let template;
  try {
    template = await getAssessmentTemplateTree(org.organizationId, id);
  } catch {
    notFound();
  }

  return <AssessmentTemplateEditorClient initialTemplate={template} />;
}
