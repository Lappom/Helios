"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { PlanTier } from "@/lib/auth/types";
import { getExerciseVideoLimitMb } from "@/lib/billing/plans";
import type { ExerciseCategoryItem, ExerciseListItem } from "@/lib/exercises/types";

type ExerciseVideoUploadProps = {
  planTier: PlanTier;
  value?: string;
  onUploaded: (url: string) => void;
};

export function ExerciseVideoUpload({
  planTier,
  value,
  onUploaded,
}: ExerciseVideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value);
  const limitMb = getExerciseVideoLimitMb(planTier);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/v1/exercises/upload", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok) {
        toast.error(payload.detail ?? payload.title ?? "Upload impossible.");
        return;
      }
      setPreviewUrl(payload.url);
      onUploaded(payload.url);
      toast.success("Vidéo uploadée.");
    } catch {
      toast.error("Erreur réseau.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-body-sm text-body-strong font-medium">
            Vidéo custom
          </p>
          <p className="text-body-sm text-muted">
            MP4, MOV, WebM — max {limitMb} MB
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          {loading ? "Upload…" : "Choisir un fichier"}
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={handleFileChange}
      />
      {previewUrl ? (
        <video
          src={previewUrl}
          controls
          className="border-hairline bg-surface-elevated aspect-video w-full rounded-lg border"
        />
      ) : (
        <div className="border-hairline bg-surface-elevated text-muted flex aspect-video items-center justify-center rounded-lg border border-dashed">
          Aperçu vidéo
        </div>
      )}
    </div>
  );
}

export type { ExerciseListItem, ExerciseCategoryItem };
