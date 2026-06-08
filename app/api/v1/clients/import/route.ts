import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { importClientsFromCsv } from "@/lib/clients/service";
import { parseCsvClients } from "@/lib/validators/clients";
import { problem } from "@/lib/api/response";

export const POST = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw problem({
      type: "validation-error",
      title: "Missing file",
      status: 400,
      detail: "CSV file is required under the 'file' field.",
    });
  }

  const content = await file.text();
  const { rows, errors: parseErrors } = parseCsvClients(content);

  if (rows.length === 0 && parseErrors.length > 0) {
    throw problem({
      type: "validation-error",
      title: "Invalid CSV",
      status: 400,
      detail: parseErrors.join("; "),
    });
  }

  const result = await importClientsFromCsv(
    org.organizationId,
    org.planTier,
    rows,
  );

  return jsonOk({
    ...result,
    errors: [...parseErrors, ...result.errors],
  });
});
