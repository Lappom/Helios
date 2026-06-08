import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const { seedSystemExercise } = await import("../lib/exercises/service");
  type SeedExercise = import("../lib/db/seed/exercise-templates").SeedExercise;

  const filePath = resolve("lib/db/seed/exercises.json");
  const raw = readFileSync(filePath, "utf8");
  const exercises = JSON.parse(raw) as SeedExercise[];

  let inserted = 0;
  for (const exercise of exercises) {
    await seedSystemExercise({
      slug: exercise.slug,
      name: exercise.name,
      description: exercise.description,
      instructions: exercise.instructions,
      muscleGroups: exercise.muscleGroups,
      equipment: exercise.equipment,
      type: exercise.type,
      media: exercise.media,
    });
    inserted += 1;
  }

  console.log(`Seeded ${inserted} system exercises.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
