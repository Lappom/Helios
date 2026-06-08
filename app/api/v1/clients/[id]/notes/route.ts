import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getClientIdFromPath } from "@/lib/api/client-route";
import { requireCoachRead, requireCoachWrite } from "@/lib/api/require-coach";
import { addClientNote, listClientNotes } from "@/lib/clients/service";
import { createClientNoteSchema, parseJsonBody } from "@/lib/validators/clients";

export const GET = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachRead();
  const id = getClientIdFromPath(request);
  const notes = await listClientNotes(org.organizationId, id);

  return jsonOk({ items: notes });
});

export const POST = withApiHandler(
  { requireOrg: true },
  async ({ request }) => {
    const org = await requireCoachWrite();
    const id = getClientIdFromPath(request);
    const body = await parseJsonBody(createClientNoteSchema, request);
    const note = await addClientNote(
      org.organizationId,
      id,
      org.clerkUserId,
      body.body,
    );

    return jsonOk(note, { status: 201 });
  },
);
