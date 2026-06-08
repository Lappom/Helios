import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateSeedExercises } from "../lib/db/seed/exercise-templates";

const exercises = generateSeedExercises(500);
const outputPath = resolve("lib/db/seed/exercises.json");

writeFileSync(outputPath, `${JSON.stringify(exercises, null, 2)}\n`, "utf8");
console.log(`Wrote ${exercises.length} exercises to ${outputPath}`);
