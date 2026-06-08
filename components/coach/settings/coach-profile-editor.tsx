"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type {
  CoachProfileDto,
  CoachServiceDto,
} from "@/lib/coach-profile/service";
import { formatPriceCents } from "@/lib/validators/coach-profile";
import { slugifyName } from "@/lib/utils/slug";

type CoachProfileEditorProps = {
  initialProfile: CoachProfileDto;
  initialServices: CoachServiceDto[];
};

function TagsInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const tag = draft.trim();
    if (!tag || values.includes(tag)) {
      setDraft("");
      return;
    }
    onChange([...values, tag]);
    setDraft("");
  }

  return (
    <div className="space-y-2">
      <label className="text-title-sm text-on-dark font-semibold">{label}</label>
      <div className="flex flex-wrap gap-2">
        {values.map((tag) => (
          <span
            key={tag}
            className="bg-surface-elevated text-body-sm text-on-dark inline-flex items-center gap-1 rounded-md px-2 py-1"
          >
            {tag}
            <button
              type="button"
              className="text-muted hover:text-on-dark"
              onClick={() => onChange(values.filter((value) => value !== tag))}
              aria-label={`Retirer ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={addTag}>
          Ajouter
        </Button>
      </div>
    </div>
  );
}

export function CoachProfileEditor({
  initialProfile,
  initialServices,
}: CoachProfileEditorProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState(initialProfile);
  const services = initialServices;
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  async function saveProfile(partial?: Partial<typeof profile>) {
    setSaving(true);
    try {
      const payload = {
        slug: partial?.slug ?? profile.slug,
        displayName: partial?.displayName ?? profile.displayName,
        bio: partial?.bio ?? profile.bio,
        photoUrl: partial?.photoUrl ?? profile.photoUrl,
        certifications: partial?.certifications ?? profile.certifications,
        specialties: partial?.specialties ?? profile.specialties,
        languages: partial?.languages ?? profile.languages,
        location: partial?.location ?? profile.location,
        socialLinks: partial?.socialLinks ?? profile.socialLinks,
        isPublished: partial?.isPublished ?? profile.isPublished,
        isInDirectory: partial?.isInDirectory ?? profile.isInDirectory,
      };

      const response = await fetch("/api/v1/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail ?? data.title ?? "Enregistrement impossible.");
        return false;
      }

      setProfile(data);
      toast.success("Profil enregistré.");
      return true;
    } catch {
      toast.error("Erreur réseau.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/v1/profile/photo", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail ?? data.title ?? "Upload impossible.");
        return;
      }

      setProfile(data.profile);
      toast.success("Photo mise à jour.");
    } catch {
      toast.error("Erreur réseau.");
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  }

  function suggestSlug() {
    const suggested = slugifyName(profile.displayName);
    if (suggested.length >= 3) {
      setProfile((current) => ({ ...current, slug: suggested }));
    }
  }

  const publicUrl = profile.isPublished
    ? `/find/coaches/${profile.slug}`
    : null;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
          Profil public
        </h1>
        <p className="text-body-md text-muted mt-2">
          Présentez-vous aux prospects et configurez vos prestations.
        </p>
      </div>

      <section className="border-hairline bg-surface-card space-y-6 rounded-lg border p-6">
        <h2 className="text-title-md text-on-dark font-semibold">Identité</h2>

        <div className="space-y-2">
          <label className="text-title-sm text-on-dark font-semibold">
            Nom affiché
          </label>
          <Input
            value={profile.displayName}
            onChange={(event) =>
              setProfile((current) => ({
                ...current,
                displayName: event.target.value,
              }))
            }
            placeholder="Marie Dupont"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label className="text-title-sm text-on-dark font-semibold">
              Slug URL
            </label>
            <Button type="button" variant="ghost" size="sm" onClick={suggestSlug}>
              Générer depuis le nom
            </Button>
          </div>
          <Input
            value={profile.slug}
            onChange={(event) =>
              setProfile((current) => ({
                ...current,
                slug: event.target.value.toLowerCase(),
              }))
            }
            placeholder="marie-dupont"
          />
          <p className="text-body-sm text-muted">
            find.helios.lappom.fr/coaches/{profile.slug || "votre-slug"}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-title-sm text-on-dark font-semibold">Photo</p>
          <div className="flex items-center gap-4">
            <div className="border-hairline bg-surface-elevated relative size-24 overflow-hidden rounded-lg border">
              {profile.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt={profile.displayName || "Photo de profil"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-muted flex size-full items-center justify-center text-xs">
                  Aucune photo
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={uploadingPhoto}
              onClick={() => photoInputRef.current?.click()}
            >
              {uploadingPhoto ? "Upload…" : "Changer la photo"}
            </Button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>
      </section>

      <section className="border-hairline bg-surface-card space-y-6 rounded-lg border p-6">
        <h2 className="text-title-md text-on-dark font-semibold">Présentation</h2>

        <div className="space-y-2">
          <label className="text-title-sm text-on-dark font-semibold">Bio</label>
          <textarea
            value={profile.bio ?? ""}
            onChange={(event) =>
              setProfile((current) => ({ ...current, bio: event.target.value }))
            }
            rows={5}
            className="border-hairline bg-surface-elevated text-body-md text-on-dark w-full rounded-lg border px-3 py-2 outline-none focus:border-primary"
            placeholder="Décrivez votre approche, votre expérience…"
          />
        </div>

        <div className="space-y-2">
          <label className="text-title-sm text-on-dark font-semibold">
            Localisation
          </label>
          <Input
            value={profile.location ?? ""}
            onChange={(event) =>
              setProfile((current) => ({
                ...current,
                location: event.target.value,
              }))
            }
            placeholder="Paris, France"
          />
        </div>

        <TagsInput
          label="Spécialités"
          values={profile.specialties}
          onChange={(specialties) =>
            setProfile((current) => ({ ...current, specialties }))
          }
          placeholder="Musculation, Running…"
        />
        <TagsInput
          label="Certifications"
          values={profile.certifications}
          onChange={(certifications) =>
            setProfile((current) => ({ ...current, certifications }))
          }
          placeholder="BPJEPS, CrossFit L1…"
        />
        <TagsInput
          label="Langues"
          values={profile.languages}
          onChange={(languages) =>
            setProfile((current) => ({ ...current, languages }))
          }
          placeholder="Français, Anglais…"
        />
      </section>

      <section className="border-hairline bg-surface-card space-y-6 rounded-lg border p-6">
        <h2 className="text-title-md text-on-dark font-semibold">Réseaux</h2>
        {(["instagram", "website", "youtube"] as const).map((key) => (
          <div key={key} className="space-y-2">
            <label className="text-title-sm text-on-dark font-semibold capitalize">
              {key}
            </label>
            <Input
              value={profile.socialLinks[key] ?? ""}
              onChange={(event) =>
                setProfile((current) => ({
                  ...current,
                  socialLinks: {
                    ...current.socialLinks,
                    [key]: event.target.value,
                  },
                }))
              }
              placeholder={`https://${key === "instagram" ? "instagram.com/…" : key === "youtube" ? "youtube.com/…" : "votresite.fr"}`}
            />
          </div>
        ))}
      </section>

      <section className="border-hairline bg-surface-card space-y-4 rounded-lg border p-6">
        <h2 className="text-title-md text-on-dark font-semibold">Prestations</h2>
        <p className="text-body-sm text-muted">
          {services.length > 0
            ? `${services.length} prestation${services.length > 1 ? "s" : ""} configurée${services.length > 1 ? "s" : ""} — tarifs, codes promo et checkout dans la boutique.`
            : "Aucune prestation. Créez vos offres vendables dans la boutique."}
        </p>
        {services.length > 0 ? (
          <ul className="text-body-sm text-muted space-y-1">
            {services.slice(0, 5).map((service) => (
              <li key={service.id}>
                {service.name} —{" "}
                {formatPriceCents(service.priceCents, service.currency)}
              </li>
            ))}
            {services.length > 5 ? (
              <li>… et {services.length - 5} autre(s)</li>
            ) : null}
          </ul>
        ) : null}
        <Button variant="outline" asChild>
          <Link href="/coach/boutique">Gérer dans Boutique</Link>
        </Button>
      </section>

      <section className="border-hairline bg-surface-card space-y-6 rounded-lg border p-6">
        <h2 className="text-title-md text-on-dark font-semibold">Publication</h2>

        <label className="text-body-sm text-body flex items-center gap-3">
          <Checkbox
            checked={profile.isPublished}
            onCheckedChange={(checked) =>
              setProfile((current) => ({
                ...current,
                isPublished: checked === true,
              }))
            }
          />
          Publier le profil (accessible via l&apos;URL publique)
        </label>

        <label className="text-body-sm text-body flex items-center gap-3">
          <Checkbox
            checked={profile.isInDirectory}
            onCheckedChange={(checked) =>
              setProfile((current) => ({
                ...current,
                isInDirectory: checked === true,
              }))
            }
          />
          Apparaître dans l&apos;annuaire Helios
        </label>

        <div className="flex flex-wrap gap-3">
          <Button disabled={saving} onClick={() => saveProfile()}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
          {publicUrl ? (
            <Button variant="outline" asChild>
              <Link href={publicUrl} target="_blank" rel="noopener noreferrer">
                Voir le profil
              </Link>
            </Button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
