"use client";

import { useUser } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PricingTierCard } from "@/components/design/pricing-tier-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createBookingRequest,
  fetchAvailableSlots,
} from "@/lib/bookings/api-client";
import type { BookingSlotDto } from "@/lib/bookings/types";
import type { CoachServiceDto } from "@/lib/coach-profile/service";
import { formatPriceCents } from "@/lib/validators/coach-profile";
import {
  addDays,
  formatDayKey,
  getWeekDays,
  startOfWeekMonday,
  WEEKDAY_LABELS,
} from "@/lib/programs/calendar-utils";
import { cn } from "@/lib/utils";

type BookingFlowClientProps = {
  coachSlug: string;
  coachName: string;
  service: CoachServiceDto;
};

type Step = "slots" | "confirm" | "success";

function formatSlotTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}

function formatSlotDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  });
}

export function BookingFlowClient({
  coachSlug,
  coachName,
  service,
}: BookingFlowClientProps) {
  const { user } = useUser();
  const [step, setStep] = useState<Step>("slots");
  const [anchorDate, setAnchorDate] = useState(() =>
    startOfWeekMonday(new Date()),
  );
  const [slots, setSlots] = useState<BookingSlotDto[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlotDto | null>(null);
  const [prospectName, setProspectName] = useState("");
  const [prospectEmail, setProspectEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmedStartAt, setConfirmedStartAt] = useState<string | null>(null);

  const weekDays = useMemo(() => getWeekDays(anchorDate), [anchorDate]);

  const slotsByDay = useMemo(() => {
    const map = new Map<string, BookingSlotDto[]>();
    for (const slot of slots) {
      const key = formatDayKey(new Date(slot.startAt));
      const bucket = map.get(key) ?? [];
      bucket.push(slot);
      map.set(key, bucket);
    }
    return map;
  }, [slots]);

  const loadSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const from = formatDayKey(weekDays[0]!);
      const to = formatDayKey(weekDays[6]!);
      const data = await fetchAvailableSlots(service.id, from, to);
      setSlots(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de charger les créneaux",
      );
    } finally {
      setLoadingSlots(false);
    }
  }, [service.id, weekDays]);

  useEffect(() => {
    void loadSlots();
  }, [loadSlots]);

  useEffect(() => {
    if (user) {
      setProspectEmail(user.primaryEmailAddress?.emailAddress ?? "");
      setProspectName(
        [user.firstName, user.lastName].filter(Boolean).join(" ") || "",
      );
    }
  }, [user]);

  async function handleConfirm() {
    if (!selectedSlot) return;

    if (!user && !prospectEmail.trim()) {
      toast.error("Indiquez votre email");
      return;
    }

    setSubmitting(true);
    try {
      await createBookingRequest({
        serviceId: service.id,
        startAt: selectedSlot.startAt,
        prospectEmail: prospectEmail.trim() || undefined,
        prospectName: prospectName.trim() || undefined,
      });
      setConfirmedStartAt(selectedSlot.startAt);
      setStep("success");
      toast.success("Rendez-vous confirmé");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Réservation impossible",
      );
      void loadSlots();
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "success" && confirmedStartAt) {
    return (
      <div className="py-section mx-auto max-w-lg px-6 text-center">
        <div className="border-hairline bg-surface-card animate-in fade-in zoom-in-95 rounded-lg border p-10 duration-500">
          <div className="bg-primary text-on-primary mx-auto mb-6 flex size-14 items-center justify-center rounded-full text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-display-sm text-on-dark mb-3 font-bold tracking-tight">
            C&apos;est confirmé
          </h2>
          <p className="text-body-md text-muted mb-2">
            {service.name} avec {coachName}
          </p>
          <p className="text-title-md text-on-dark mb-8 font-semibold">
            {formatSlotDate(confirmedStartAt)} à{" "}
            {formatSlotTime(confirmedStartAt)}
          </p>
          <Button
            asChild
            className="bg-primary text-on-primary hover:bg-primary-active"
          >
            <Link href={`/find/coaches/${coachSlug}`}>
              Retour au profil
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-section mx-auto max-w-5xl px-6">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/find/coaches/${coachSlug}`}>
            ← Retour au profil
          </Link>
        </Button>
        <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
          Réserver — {service.name}
        </h1>
        <p className="text-body-md text-muted mt-2">
          avec {coachName}
        </p>
      </div>

      <div className="mb-10 max-w-sm">
        <PricingTierCard
          name={service.name}
          price={formatPriceCents(service.priceCents, service.currency)}
          period=""
          description={service.description ?? `${service.durationMinutes} min`}
          features={[
            `${service.durationMinutes} minutes`,
            service.isOnline ? "En ligne" : "En présentiel",
          ]}
          hideCta
          className="pointer-events-none"
        />
      </div>

      {step === "slots" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-title-lg text-on-dark font-semibold">
              Choisissez un créneau
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="border-hairline"
                onClick={() =>
                  setAnchorDate((d) => addDays(d, -7))
                }
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-hairline"
                onClick={() =>
                  setAnchorDate((d) => addDays(d, 7))
                }
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {loadingSlots ? (
            <p className="text-body-md text-muted">Chargement des créneaux…</p>
          ) : slots.length === 0 ? (
            <div className="border-hairline bg-surface-card rounded-lg border p-8 text-center">
              <p className="text-body-md text-muted">
                Aucun créneau disponible cette semaine. Essayez la semaine
                suivante.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-7">
              {weekDays.map((day, index) => {
                const key = formatDayKey(day);
                const daySlots = slotsByDay.get(key) ?? [];
                return (
                  <div
                    key={key}
                    className="border-hairline bg-surface-card animate-in fade-in slide-in-from-bottom-2 rounded-lg border p-3 fill-mode-both duration-500"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <p className="text-caption-uppercase text-muted mb-1 tracking-widest uppercase">
                      {WEEKDAY_LABELS[index]}
                    </p>
                    <p className="text-title-sm text-on-dark mb-3 font-semibold">
                      {day.getDate()}
                    </p>
                    <div className="space-y-2">
                      {daySlots.map((slot) => (
                        <button
                          key={slot.startAt}
                          type="button"
                          onClick={() => {
                            setSelectedSlot(slot);
                            setStep("confirm");
                          }}
                          className={cn(
                            "border-hairline hover:border-primary/50 hover:bg-primary/10 w-full rounded-md border px-2 py-2 text-sm font-semibold transition-colors",
                            selectedSlot?.startAt === slot.startAt &&
                              "border-primary bg-primary/15 text-primary",
                          )}
                        >
                          {formatSlotTime(slot.startAt)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {step === "confirm" && selectedSlot ? (
        <div className="border-hairline bg-surface-card mx-auto max-w-md animate-in fade-in slide-in-from-bottom-4 rounded-lg border p-8 duration-300">
          <h2 className="text-title-lg text-on-dark mb-4 font-semibold">
            Confirmer la réservation
          </h2>
          <p className="text-body-md text-muted mb-6">
            {formatSlotDate(selectedSlot.startAt)} à{" "}
            {formatSlotTime(selectedSlot.startAt)}
          </p>

          {!user ? (
            <div className="mb-4 space-y-3">
              <Input
                placeholder="Votre nom"
                value={prospectName}
                onChange={(e) => setProspectName(e.target.value)}
                className="bg-surface-elevated border-hairline"
              />
              <Input
                type="email"
                placeholder="Votre email"
                value={prospectEmail}
                onChange={(e) => setProspectEmail(e.target.value)}
                className="bg-surface-elevated border-hairline"
                required
              />
            </div>
          ) : (
            <p className="text-body-md text-muted mb-6">
              Réservation en tant que{" "}
              <span className="text-on-dark">{prospectEmail}</span>
            </p>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-hairline flex-1"
              onClick={() => setStep("slots")}
            >
              Retour
            </Button>
            <Button
              className="bg-primary text-on-primary hover:bg-primary-active flex-1"
              disabled={submitting}
              onClick={handleConfirm}
            >
              {submitting ? "Confirmation…" : "Confirmer"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
