"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DIRECTORY_SPECIALTIES } from "@/lib/validators/coach-profile";

export function CoachDirectoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeSpecialty = searchParams.get("specialty") ?? "";
  const search = searchParams.get("search") ?? "";
  const location = searchParams.get("location") ?? "";

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/find/coaches?${params.toString()}`);
    });
  }

  return (
    <div className={cn("space-y-6", isPending && "opacity-70")}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateParams({ specialty: null })}
          className={cn(
            "rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
            !activeSpecialty
              ? "bg-surface-card text-on-dark"
              : "text-muted hover:text-on-dark",
          )}
        >
          Tous
        </button>
        {DIRECTORY_SPECIALTIES.map((specialty) => (
          <button
            key={specialty}
            type="button"
            onClick={() =>
              updateParams({
                specialty: activeSpecialty === specialty ? null : specialty,
              })
            }
            className={cn(
              "rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
              activeSpecialty === specialty
                ? "bg-surface-card text-on-dark"
                : "text-muted hover:text-on-dark",
            )}
          >
            {specialty}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          value={search}
          onChange={(event) => updateParams({ search: event.target.value })}
          placeholder="Rechercher un coach…"
        />
        <Input
          value={location}
          onChange={(event) => updateParams({ location: event.target.value })}
          placeholder="Ville ou région…"
        />
      </div>
    </div>
  );
}
