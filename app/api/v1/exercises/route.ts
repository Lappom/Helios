import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { parsePagination, withTotalCountHeaders } from "@/lib/api/pagination";
import { requireCoachRead, requireCoachWrite } from "@/lib/api/require-coach";
import {
  createCustomExercise,
  listExercises,
} from "@/lib/exercises/service";
import {
  createExerciseSchema,
  parseListExercisesQuery,
} from "@/lib/validators/exercises";
import { parseJsonBody } from "@/lib/validators/clients";

export const GET = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachRead();
  const searchParams = new URL(request.url).searchParams;
  const pagination = parsePagination(searchParams);
  const query = parseListExercisesQuery(searchParams, pagination);

  const { items, total } = await listExercises(
    org.organizationId,
    org.clerkUserId,
    query,
  );

  return jsonOk(
    { items, page: pagination.page, limit: pagination.limit },
    { headers: withTotalCountHeaders(undefined, total) },
  );
});

export const POST = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const body = await parseJsonBody(createExerciseSchema, request);
  const exercise = await createCustomExercise(
    org.organizationId,
    org.clerkUserId,
    body,
  );

  return jsonOk(exercise, { status: 201 });
});
