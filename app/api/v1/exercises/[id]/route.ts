import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getExerciseIdFromPath } from "@/lib/api/exercise-route";
import { requireCoachRead, requireCoachWrite } from "@/lib/api/require-coach";
import {
  deleteCustomExercise,
  getExerciseById,
  setExerciseAlias,
  setExerciseHidden,
  updateCustomExercise,
} from "@/lib/exercises/service";
import {
  hideExerciseSchema,
  setExerciseAliasSchema,
  updateExerciseSchema,
} from "@/lib/validators/exercises";
import { parseJsonBody } from "@/lib/validators/clients";
import { z } from "zod";

const patchExerciseSchema = updateExerciseSchema
  .extend({
    alias: setExerciseAliasSchema.shape.alias.optional(),
    hidden: hideExerciseSchema.shape.hidden.optional(),
  })
  .refine(
    (value) =>
      Object.keys(value).length > 0,
    "At least one field is required.",
  );

export const GET = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachRead();
  const id = getExerciseIdFromPath(request);
  const exercise = await getExerciseById(
    org.organizationId,
    org.clerkUserId,
    id,
  );

  return jsonOk(exercise);
});

export const PATCH = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const id = getExerciseIdFromPath(request);
  const body = await parseJsonBody(patchExerciseSchema, request);

  if (body.alias !== undefined) {
    await setExerciseAlias(org.organizationId, id, { alias: body.alias });
  }

  if (body.hidden !== undefined) {
    await setExerciseHidden(org.organizationId, id, body.hidden);
  }

  const { alias: _alias, hidden: _hidden, ...updateInput } = body;

  if (Object.keys(updateInput).length > 0) {
    await updateCustomExercise(
      org.organizationId,
      org.clerkUserId,
      id,
      updateInput,
    );
  }

  const exercise = await getExerciseById(
    org.organizationId,
    org.clerkUserId,
    id,
  );

  return jsonOk(exercise);
});

export const DELETE = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const id = getExerciseIdFromPath(request);
  await deleteCustomExercise(org.organizationId, id);

  return jsonOk({ deleted: true });
});
