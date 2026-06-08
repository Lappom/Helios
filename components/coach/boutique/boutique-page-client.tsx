"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CoachServiceDto } from "@/lib/coach-profile/service";
import type { PromoCodeDto } from "@/lib/promo-codes/service";
import type { ProgramListItem } from "@/lib/programs/types";
import {
  COACH_SERVICE_TYPES,
  formatPriceCents,
  type CoachServiceType,
} from "@/lib/validators/coach-profile";
import type { PromoDiscountType } from "@/lib/validators/checkout";
import { cn } from "@/lib/utils";

type BoutiquePageClientProps = {
  initialServices: CoachServiceDto[];
  initialPromoCodes: PromoCodeDto[];
  programs: ProgramListItem[];
};

type Tab = "services" | "promos";

const SERVICE_TYPE_LABELS: Record<CoachServiceType, string> = {
  assessment: "Bilan",
  coaching: "Coaching",
  call: "Appel",
};

const emptyServiceDraft = {
  name: "",
  description: "",
  durationMinutes: 60,
  priceCents: 5000,
  type: "coaching" as CoachServiceType,
  isOnline: false,
  bookingEnabled: false,
  paymentInstructions: "",
  defaultProgramId: "" as string | "",
};

const emptyPromoDraft = {
  code: "",
  label: "",
  discountType: "percent" as PromoDiscountType,
  discountValue: 10,
  maxRedemptions: "" as string | number,
  expiresAt: "",
  isActive: true,
};

export function BoutiquePageClient({
  initialServices,
  initialPromoCodes,
  programs,
}: BoutiquePageClientProps) {
  const [tab, setTab] = useState<Tab>("services");
  const [services, setServices] = useState(initialServices);
  const [promoCodes, setPromoCodes] = useState(initialPromoCodes);
  const [serviceDraft, setServiceDraft] = useState(emptyServiceDraft);
  const [promoDraft, setPromoDraft] = useState(emptyPromoDraft);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  async function handleAddService() {
    if (!serviceDraft.name.trim()) {
      toast.error("Le nom est requis.");
      return;
    }

    try {
      const response = await fetch("/api/v1/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: serviceDraft.name.trim(),
          description: serviceDraft.description.trim() || undefined,
          durationMinutes: serviceDraft.durationMinutes,
          priceCents: serviceDraft.priceCents,
          type: serviceDraft.type,
          isOnline: serviceDraft.isOnline,
          bookingEnabled: serviceDraft.bookingEnabled,
          paymentInstructions: serviceDraft.paymentInstructions.trim() || undefined,
          defaultProgramId: serviceDraft.defaultProgramId || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail ?? data.title ?? "Création impossible.");
        return;
      }
      setServices((current) => [...current, data]);
      setServiceDraft(emptyServiceDraft);
      toast.success("Prestation ajoutée.");
    } catch {
      toast.error("Erreur réseau.");
    }
  }

  async function handlePatchService(
    serviceId: string,
    patch: Partial<CoachServiceDto>,
  ) {
    try {
      const response = await fetch(`/api/v1/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail ?? data.title ?? "Mise à jour impossible.");
        return;
      }
      setServices((current) =>
        current.map((service) => (service.id === serviceId ? data : service)),
      );
      toast.success("Prestation mise à jour.");
    } catch {
      toast.error("Erreur réseau.");
    }
  }

  async function handleDeleteService(serviceId: string) {
    try {
      const response = await fetch(`/api/v1/services/${serviceId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.detail ?? data.title ?? "Suppression impossible.");
        return;
      }
      setServices((current) =>
        current.filter((service) => service.id !== serviceId),
      );
      toast.success("Prestation supprimée.");
    } catch {
      toast.error("Erreur réseau.");
    }
  }

  async function handleCreatePromo() {
    if (!promoDraft.code.trim()) {
      toast.error("Le code est requis.");
      return;
    }

    try {
      const response = await fetch("/api/v1/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoDraft.code.trim(),
          label: promoDraft.label.trim() || undefined,
          discountType: promoDraft.discountType,
          discountValue:
            promoDraft.discountType === "fixed"
              ? Math.round(Number(promoDraft.discountValue) * 100)
              : Number(promoDraft.discountValue),
          maxRedemptions: promoDraft.maxRedemptions
            ? Number(promoDraft.maxRedemptions)
            : undefined,
          expiresAt: promoDraft.expiresAt
            ? new Date(promoDraft.expiresAt).toISOString()
            : undefined,
          isActive: promoDraft.isActive,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail ?? data.title ?? "Création impossible.");
        return;
      }
      setPromoCodes((current) => [...current, data]);
      setPromoDraft(emptyPromoDraft);
      toast.success("Code promo créé.");
    } catch {
      toast.error("Erreur réseau.");
    }
  }

  async function handleTogglePromo(promo: PromoCodeDto) {
    try {
      const response = await fetch(`/api/v1/promo-codes/${promo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !promo.isActive }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail ?? data.title ?? "Mise à jour impossible.");
        return;
      }
      setPromoCodes((current) =>
        current.map((item) => (item.id === promo.id ? data : item)),
      );
    } catch {
      toast.error("Erreur réseau.");
    }
  }

  async function handleDeletePromo(promoId: string) {
    try {
      const response = await fetch(`/api/v1/promo-codes/${promoId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.detail ?? data.title ?? "Suppression impossible.");
        return;
      }
      setPromoCodes((current) => current.filter((item) => item.id !== promoId));
      toast.success("Code promo supprimé.");
    } catch {
      toast.error("Erreur réseau.");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
          Boutique
        </h1>
        <p className="text-body-md text-muted mt-2">
          Gérez vos prestations vendables, les codes promo et les liens
          checkout.
        </p>
      </div>

      <div className="flex gap-2">
        {(["services", "promos"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-semibold transition-colors",
              tab === value
                ? "bg-surface-card text-on-dark"
                : "text-muted hover:text-on-dark",
            )}
          >
            {value === "services" ? "Prestations" : "Codes promo"}
          </button>
        ))}
      </div>

      {tab === "services" ? (
        <div className="space-y-6">
          {services.length > 0 ? (
            <ul className="space-y-4">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="border-hairline bg-surface-card rounded-lg border p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-title-md text-on-dark font-semibold">
                          {service.name}
                        </p>
                        {service.bookingEnabled ? (
                          <span className="bg-primary text-on-primary text-caption rounded-full px-2 py-0.5 font-semibold uppercase">
                            RDV
                          </span>
                        ) : null}
                      </div>
                      <p className="text-body-sm text-muted">
                        {formatPriceCents(service.priceCents, service.currency)}{" "}
                        · {service.durationMinutes} min ·{" "}
                        {SERVICE_TYPE_LABELS[service.type]}
                      </p>
                      {service.paymentInstructions ? (
                        <p className="text-body-sm text-muted">
                          {service.paymentInstructions}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/checkout/${service.id}`} target="_blank">
                          <ExternalLink className="mr-1 size-3.5" />
                          Checkout
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditingServiceId(
                            editingServiceId === service.id ? null : service.id,
                          )
                        }
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleDeleteService(service.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {editingServiceId === service.id ? (
                    <div className="border-hairline mt-4 space-y-4 border-t pt-4">
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={service.bookingEnabled}
                            onCheckedChange={(checked) =>
                              void handlePatchService(service.id, {
                                bookingEnabled: checked === true,
                              })
                            }
                          />
                          Réservation en ligne
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={service.isOnline}
                            onCheckedChange={(checked) =>
                              void handlePatchService(service.id, {
                                isOnline: checked === true,
                              })
                            }
                          />
                          En ligne
                        </label>
                      </div>
                      <textarea
                        defaultValue={service.paymentInstructions ?? ""}
                        rows={2}
                        className="border-hairline bg-surface-elevated text-body-md text-on-dark w-full rounded-lg border px-3 py-2 outline-none"
                        placeholder="Modalités de paiement (virement, espèces…)"
                        onBlur={(event) => {
                          const value = event.target.value.trim();
                          if (value !== (service.paymentInstructions ?? "")) {
                            void handlePatchService(service.id, {
                              paymentInstructions: value || null,
                            });
                          }
                        }}
                      />
                      <Select
                        value={service.defaultProgramId ?? "none"}
                        onValueChange={(value) =>
                          void handlePatchService(service.id, {
                            defaultProgramId: value === "none" ? null : value,
                          })
                        }
                      >
                        <SelectTrigger className="border-hairline bg-surface-elevated">
                          <SelectValue placeholder="Programme à assigner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucun programme</SelectItem>
                          {programs.map((program) => (
                            <SelectItem key={program.id} value={program.id}>
                              {program.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-sm text-muted">
              Aucune prestation. Ajoutez-en une ci-dessous.
            </p>
          )}

          <div className="border-hairline space-y-4 rounded-lg border border-dashed p-6">
            <p className="text-title-sm text-on-dark font-semibold">
              Nouvelle prestation
            </p>
            <Input
              value={serviceDraft.name}
              onChange={(event) =>
                setServiceDraft((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="Coaching 3 mois"
            />
            <textarea
              value={serviceDraft.description}
              onChange={(event) =>
                setServiceDraft((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={2}
              className="border-hairline bg-surface-elevated text-body-md text-on-dark w-full rounded-lg border px-3 py-2 outline-none"
              placeholder="Description (optionnel)"
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                type="number"
                min={15}
                max={480}
                value={serviceDraft.durationMinutes}
                onChange={(event) =>
                  setServiceDraft((current) => ({
                    ...current,
                    durationMinutes: Number(event.target.value),
                  }))
                }
                placeholder="Durée (min)"
              />
              <Input
                type="number"
                min={0}
                step={1}
                value={serviceDraft.priceCents / 100}
                onChange={(event) =>
                  setServiceDraft((current) => ({
                    ...current,
                    priceCents: Math.round(Number(event.target.value) * 100),
                  }))
                }
                placeholder="Prix (€)"
              />
              <Select
                value={serviceDraft.type}
                onValueChange={(value: CoachServiceType) =>
                  setServiceDraft((current) => ({ ...current, type: value }))
                }
              >
                <SelectTrigger className="border-hairline bg-surface-elevated">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COACH_SERVICE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {SERVICE_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={serviceDraft.bookingEnabled}
                  onCheckedChange={(checked) =>
                    setServiceDraft((current) => ({
                      ...current,
                      bookingEnabled: checked === true,
                    }))
                  }
                />
                Réservation en ligne
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={serviceDraft.isOnline}
                  onCheckedChange={(checked) =>
                    setServiceDraft((current) => ({
                      ...current,
                      isOnline: checked === true,
                    }))
                  }
                />
                En ligne
              </label>
            </div>
            <textarea
              value={serviceDraft.paymentInstructions}
              onChange={(event) =>
                setServiceDraft((current) => ({
                  ...current,
                  paymentInstructions: event.target.value,
                }))
              }
              rows={2}
              className="border-hairline bg-surface-elevated text-body-md text-on-dark w-full rounded-lg border px-3 py-2 outline-none"
              placeholder="Modalités de paiement"
            />
            <Select
              value={serviceDraft.defaultProgramId || "none"}
              onValueChange={(value) =>
                setServiceDraft((current) => ({
                  ...current,
                  defaultProgramId: value === "none" ? "" : value,
                }))
              }
            >
              <SelectTrigger className="border-hairline bg-surface-elevated">
                <SelectValue placeholder="Programme à assigner au checkout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun programme</SelectItem>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              className="bg-primary text-on-primary hover:bg-primary-active"
              onClick={() => void handleAddService()}
            >
              <Plus className="mr-2 size-4" />
              Ajouter la prestation
            </Button>
          </div>
        </div>
      ) : null}

      {tab === "promos" ? (
        <div className="space-y-6">
          {promoCodes.length > 0 ? (
            <ul className="space-y-3">
              {promoCodes.map((promo) => (
                <li
                  key={promo.id}
                  className="border-hairline bg-surface-card flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-on-dark font-semibold">
                        {promo.code}
                      </span>
                      {promo.isActive ? (
                        <span className="bg-primary text-on-primary text-caption rounded-full px-2 py-0.5 font-semibold uppercase">
                          Actif
                        </span>
                      ) : (
                        <span className="text-caption text-muted uppercase">
                          Inactif
                        </span>
                      )}
                    </div>
                    <p className="text-body-sm text-muted">
                      {promo.discountType === "percent"
                        ? `-${promo.discountValue}%`
                        : `-${formatPriceCents(promo.discountValue)}`}{" "}
                      · {promo.redemptionCount}
                      {promo.maxRedemptions
                        ? ` / ${promo.maxRedemptions}`
                        : ""}{" "}
                      utilisations
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleTogglePromo(promo)}
                    >
                      {promo.isActive ? "Désactiver" : "Activer"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleDeletePromo(promo.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-sm text-muted">Aucun code promo.</p>
          )}

          <div className="border-hairline space-y-4 rounded-lg border border-dashed p-6">
            <p className="text-title-sm text-on-dark font-semibold">
              Nouveau code promo
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={promoDraft.code}
                onChange={(event) =>
                  setPromoDraft((current) => ({
                    ...current,
                    code: event.target.value.toUpperCase(),
                  }))
                }
                placeholder="CODE2026"
                className="uppercase"
              />
              <Input
                value={promoDraft.label}
                onChange={(event) =>
                  setPromoDraft((current) => ({
                    ...current,
                    label: event.target.value,
                  }))
                }
                placeholder="Libellé (optionnel)"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Select
                value={promoDraft.discountType}
                onValueChange={(value: PromoDiscountType) =>
                  setPromoDraft((current) => ({
                    ...current,
                    discountType: value,
                  }))
                }
              >
                <SelectTrigger className="border-hairline bg-surface-elevated">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Pourcentage</SelectItem>
                  <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                min={1}
                value={promoDraft.discountValue}
                onChange={(event) =>
                  setPromoDraft((current) => ({
                    ...current,
                    discountValue: Number(event.target.value),
                  }))
                }
                placeholder={
                  promoDraft.discountType === "percent" ? "%" : "€"
                }
              />
              <Input
                type="number"
                min={1}
                value={promoDraft.maxRedemptions}
                onChange={(event) =>
                  setPromoDraft((current) => ({
                    ...current,
                    maxRedemptions: event.target.value,
                  }))
                }
                placeholder="Max utilisations"
              />
            </div>
            <Input
              type="date"
              value={promoDraft.expiresAt}
              onChange={(event) =>
                setPromoDraft((current) => ({
                  ...current,
                  expiresAt: event.target.value,
                }))
              }
            />
            <Button
              type="button"
              className="bg-primary text-on-primary hover:bg-primary-active"
              onClick={() => void handleCreatePromo()}
            >
              <Plus className="mr-2 size-4" />
              Créer le code
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
