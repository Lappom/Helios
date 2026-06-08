import type { ExerciseType } from "@/lib/validators/exercises";
import {
  EQUIPMENT_TYPES,
  MUSCLE_GROUPS,
} from "@/lib/validators/exercises";

export type SeedExercise = {
  slug: string;
  name: string;
  description: string;
  instructions: string;
  muscleGroups: (typeof MUSCLE_GROUPS)[number][];
  equipment: (typeof EQUIPMENT_TYPES)[number][];
  type: ExerciseType;
  media: {
    thumbnailUrl?: string;
    videoUrl?: string;
    videoType?: "youtube";
  };
};

const BASE_EXERCISES: Omit<SeedExercise, "slug">[] = [
  {
    name: "Back Squat",
    description: "Compound lower-body strength pattern.",
    instructions:
      "Brace core, sit hips back and down, keep chest up, drive through mid-foot to stand.",
    muscleGroups: ["quadriceps", "glutes", "core"],
    equipment: ["barbell"],
    type: "strength",
    media: {},
  },
  {
    name: "Front Squat",
    description: "Upright squat variation emphasizing quads and core.",
    instructions:
      "Keep elbows high, torso vertical, descend with control, stand without losing rack position.",
    muscleGroups: ["quadriceps", "core", "glutes"],
    equipment: ["barbell"],
    type: "strength",
    media: {},
  },
  {
    name: "Romanian Deadlift",
    description: "Hip hinge targeting hamstrings and glutes.",
    instructions:
      "Soft knee bend, push hips back, bar close to legs, feel stretch in hamstrings, return with glute squeeze.",
    muscleGroups: ["hamstrings", "glutes", "back"],
    equipment: ["barbell"],
    type: "strength",
    media: {},
  },
  {
    name: "Conventional Deadlift",
    description: "Full-body pull from the floor.",
    instructions:
      "Set neutral spine, wedge hips, push floor away, lock out with glutes without hyperextending.",
    muscleGroups: ["hamstrings", "glutes", "back", "traps"],
    equipment: ["barbell"],
    type: "strength",
    media: {},
  },
  {
    name: "Bench Press",
    description: "Horizontal press for chest and triceps.",
    instructions:
      "Retract scapula, lower bar to mid-chest, press up while keeping feet planted.",
    muscleGroups: ["chest", "triceps", "shoulders"],
    equipment: ["barbell"],
    type: "strength",
    media: {},
  },
  {
    name: "Overhead Press",
    description: "Vertical pressing for shoulders and triceps.",
    instructions:
      "Brace glutes and core, press bar overhead in straight line, avoid excessive back arch.",
    muscleGroups: ["shoulders", "triceps", "core"],
    equipment: ["barbell"],
    type: "strength",
    media: {},
  },
  {
    name: "Pull-Up",
    description: "Vertical pull for lats and biceps.",
    instructions:
      "Start from dead hang, pull chest toward bar, control descent without swinging.",
    muscleGroups: ["lats", "biceps", "back"],
    equipment: ["pull_up_bar"],
    type: "strength",
    media: {},
  },
  {
    name: "Chin-Up",
    description: "Supinated pull-up emphasizing biceps.",
    instructions:
      "Palms facing you, pull until chin clears bar, lower under control.",
    muscleGroups: ["biceps", "lats", "back"],
    equipment: ["pull_up_bar"],
    type: "strength",
    media: {},
  },
  {
    name: "Barbell Row",
    description: "Horizontal row for upper back thickness.",
    instructions:
      "Hinge torso, pull bar to lower ribs, squeeze shoulder blades, lower with control.",
    muscleGroups: ["back", "lats", "biceps"],
    equipment: ["barbell"],
    type: "strength",
    media: {},
  },
  {
    name: "Push-Up",
    description: "Bodyweight horizontal press.",
    instructions:
      "Hands under shoulders, body in straight line, lower chest to floor, press back up.",
    muscleGroups: ["chest", "triceps", "core"],
    equipment: ["bodyweight"],
    type: "strength",
    media: {},
  },
  {
    name: "Dumbbell Lunges",
    description: "Single-leg strength and stability.",
    instructions:
      "Step long, drop back knee toward floor, drive through front heel to return.",
    muscleGroups: ["quadriceps", "glutes", "core"],
    equipment: ["dumbbell"],
    type: "strength",
    media: {},
  },
  {
    name: "Bulgarian Split Squat",
    description: "Rear-foot elevated split squat.",
    instructions:
      "Rear foot on bench, descend vertically on front leg, keep torso slightly forward.",
    muscleGroups: ["quadriceps", "glutes"],
    equipment: ["dumbbell"],
    type: "strength",
    media: {},
  },
  {
    name: "Hip Thrust",
    description: "Glute-focused hip extension.",
    instructions:
      "Upper back on bench, drive hips up, pause at top with glute squeeze, lower under control.",
    muscleGroups: ["glutes", "hamstrings", "core"],
    equipment: ["barbell"],
    type: "strength",
    media: {},
  },
  {
    name: "Lat Pulldown",
    description: "Machine vertical pull.",
    instructions:
      "Pull bar to upper chest, lead with elbows, avoid leaning excessively back.",
    muscleGroups: ["lats", "biceps", "back"],
    equipment: ["cable"],
    type: "strength",
    media: {},
  },
  {
    name: "Cable Fly",
    description: "Chest isolation with constant tension.",
    instructions:
      "Slight bend in elbows, bring handles together in arc, control return.",
    muscleGroups: ["chest"],
    equipment: ["cable"],
    type: "strength",
    media: {},
  },
  {
    name: "Leg Press",
    description: "Machine-based quad and glute loading.",
    instructions:
      "Feet shoulder-width, lower sled with control, press without locking knees aggressively.",
    muscleGroups: ["quadriceps", "glutes"],
    equipment: ["machine"],
    type: "strength",
    media: {},
  },
  {
    name: "Leg Curl",
    description: "Hamstring isolation.",
    instructions:
      "Curl pad toward glutes, pause briefly, return slowly without hip lift.",
    muscleGroups: ["hamstrings"],
    equipment: ["machine"],
    type: "strength",
    media: {},
  },
  {
    name: "Leg Extension",
    description: "Quadriceps isolation.",
    instructions:
      "Extend knees fully without snapping, lower with 2-3 second eccentric.",
    muscleGroups: ["quadriceps"],
    equipment: ["machine"],
    type: "strength",
    media: {},
  },
  {
    name: "Face Pull",
    description: "Rear delt and rotator cuff health.",
    instructions:
      "Pull rope toward face, externally rotate at end range, squeeze upper back.",
    muscleGroups: ["shoulders", "traps", "back"],
    equipment: ["cable"],
    type: "strength",
    media: {},
  },
  {
    name: "Lateral Raise",
    description: "Side delt isolation.",
    instructions:
      "Raise dumbbells to shoulder height with soft elbows, lower without swinging.",
    muscleGroups: ["shoulders"],
    equipment: ["dumbbell"],
    type: "strength",
    media: {},
  },
  {
    name: "Biceps Curl",
    description: "Elbow flexion for biceps.",
    instructions:
      "Keep elbows pinned, curl without rocking torso, lower under control.",
    muscleGroups: ["biceps"],
    equipment: ["dumbbell"],
    type: "strength",
    media: {},
  },
  {
    name: "Triceps Pushdown",
    description: "Cable triceps extension.",
    instructions:
      "Elbows at sides, extend fully, return without shoulder movement.",
    muscleGroups: ["triceps"],
    equipment: ["cable"],
    type: "strength",
    media: {},
  },
  {
    name: "Plank",
    description: "Isometric core anti-extension.",
    instructions:
      "Elbows under shoulders, glutes engaged, maintain neutral spine, breathe steadily.",
    muscleGroups: ["core", "abs"],
    equipment: ["bodyweight"],
    type: "strength",
    media: {},
  },
  {
    name: "Dead Bug",
    description: "Core stability with limb movement.",
    instructions:
      "Lower opposite arm and leg while keeping lower back pressed to floor.",
    muscleGroups: ["core", "abs"],
    equipment: ["bodyweight"],
    type: "strength",
    media: {},
  },
  {
    name: "Russian Twist",
    description: "Rotational core exercise.",
    instructions:
      "Rotate torso side to side with control, keep chest lifted.",
    muscleGroups: ["obliques", "core"],
    equipment: ["medicine_ball"],
    type: "strength",
    media: {},
  },
  {
    name: "Box Jump",
    description: "Explosive lower-body plyometric.",
    instructions:
      "Swing arms, land softly on box with bent knees, step down between reps.",
    muscleGroups: ["quadriceps", "glutes", "calves"],
    equipment: ["bodyweight"],
    type: "plyometric",
    media: {},
  },
  {
    name: "Burpee",
    description: "Full-body conditioning movement.",
    instructions:
      "Drop to floor, chest touches, jump feet in, explode upward with clap optional.",
    muscleGroups: ["full_body", "core"],
    equipment: ["bodyweight"],
    type: "cardio",
    media: {},
  },
  {
    name: "Assault Bike Sprint",
    description: "High-intensity cardio intervals.",
    instructions:
      "Drive arms and legs together, maintain upright posture, breathe rhythmically.",
    muscleGroups: ["full_body"],
    equipment: ["machine"],
    type: "cardio",
    media: {},
  },
  {
    name: "Rowing Ergometer",
    description: "Low-impact full-body cardio.",
    instructions:
      "Drive with legs first, lean back slightly, pull handle to sternum, reverse sequence.",
    muscleGroups: ["back", "quadriceps", "full_body"],
    equipment: ["machine"],
    type: "cardio",
    media: {},
  },
  {
    name: "World's Greatest Stretch",
    description: "Dynamic mobility flow.",
    instructions:
      "Lunge, rotate open, reach overhead, hold briefly each side.",
    muscleGroups: ["hip_flexors", "glutes", "back"],
    equipment: ["bodyweight"],
    type: "mobility",
    media: {},
  },
  {
    name: "Cat-Cow",
    description: "Spinal flexion and extension mobility.",
    instructions:
      "Alternate rounding and extending spine with slow breaths.",
    muscleGroups: ["back", "core"],
    equipment: ["bodyweight"],
    type: "mobility",
    media: {},
  },
  {
    name: "90/90 Hip Switch",
    description: "Hip internal and external rotation drill.",
    instructions:
      "Switch legs smoothly while keeping torso tall, pause at end ranges.",
    muscleGroups: ["glutes", "hip_flexors"],
    equipment: ["bodyweight"],
    type: "mobility",
    media: {},
  },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const EQUIPMENT_PREFIX: Partial<
  Record<(typeof EQUIPMENT_TYPES)[number], string>
> = {
  barbell: "Barbell",
  dumbbell: "Dumbbell",
  kettlebell: "Kettlebell",
  cable: "Cable",
  machine: "Machine",
  bodyweight: "Bodyweight",
  resistance_band: "Band",
  medicine_ball: "Med Ball",
  smith_machine: "Smith Machine",
  trap_bar: "Trap Bar",
  ez_bar: "EZ Bar",
  suspension_trainer: "TRX",
};

const VARIATIONS = [
  "",
  "Pause",
  "Tempo",
  "Single-Arm",
  "Single-Leg",
  "Wide Grip",
  "Close Grip",
  "Deficit",
  "Incline",
  "Decline",
  "Seated",
  "Standing",
  "Alternating",
  "Eccentric",
  "Isometric",
];

const ANGLES = ["", "Low", "High", "Neutral"];

export function generateSeedExercises(targetCount = 500): SeedExercise[] {
  const results: SeedExercise[] = [];
  const seen = new Set<string>();

  function addExercise(exercise: Omit<SeedExercise, "slug">) {
    const slug = slugify(exercise.name);
    if (seen.has(slug)) return;
    seen.add(slug);
    results.push({ ...exercise, slug });
  }

  for (const base of BASE_EXERCISES) {
    addExercise(base);
  }

  for (const muscle of MUSCLE_GROUPS) {
    for (const equipment of EQUIPMENT_TYPES) {
      for (const variation of VARIATIONS) {
        if (results.length >= targetCount) break;
        const prefix = EQUIPMENT_PREFIX[equipment] ?? equipment;
        const muscleLabel = muscle.replace(/_/g, " ");
        const nameParts = [variation, prefix, muscleLabel, "Exercise"].filter(
          Boolean,
        );
        const name = nameParts.join(" ").replace(/\s+/g, " ").trim();
        addExercise({
          name,
          description: `${prefix} focused movement for ${muscleLabel}.`,
          instructions: `Set up with ${prefix.toLowerCase()}, control the eccentric, execute with full range of motion.`,
          muscleGroups: [muscle],
          equipment: [equipment],
          type:
            equipment === "bodyweight" && variation.includes("Jump")
              ? "plyometric"
              : equipment === "machine" && muscle === "full_body"
                ? "cardio"
                : variation === "Isometric" || variation === "Tempo"
                  ? "strength"
                  : "strength",
          media: {},
        });
      }
    }
  }

  for (const angle of ANGLES) {
    for (const base of BASE_EXERCISES) {
      if (results.length >= targetCount) break;
      if (!angle) continue;
      addExercise({
        ...base,
        name: `${angle} ${base.name}`,
        description: `${angle} angle variation of ${base.name.toLowerCase()}.`,
      });
    }
  }

  while (results.length < targetCount) {
    const index = results.length + 1;
    const muscle = MUSCLE_GROUPS[index % MUSCLE_GROUPS.length]!;
    const equipment = EQUIPMENT_TYPES[index % EQUIPMENT_TYPES.length]!;
    addExercise({
      name: `Coach Library Movement ${index}`,
      description: `Supplemental ${muscle.replace(/_/g, " ")} pattern.`,
      instructions: "Execute with controlled tempo and full range of motion.",
      muscleGroups: [muscle],
      equipment: [equipment],
      type: index % 7 === 0 ? "cardio" : index % 11 === 0 ? "mobility" : "strength",
      media: {},
    });
  }

  return results.slice(0, targetCount);
}
