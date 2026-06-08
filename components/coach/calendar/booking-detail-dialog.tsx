"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  cancelBookingRequest,
  patchBookingStatusRequest,
} from "@/lib/bookings/api-client";
import type { BookingListItem } from "@/lib/bookings/types";

type BookingDetailDialogProps = {
  booking: BookingListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}

export function BookingDetailDialog({
  booking,
  open,
  onOpenChange,
  onUpdated,
}: BookingDetailDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!booking) return null;

  async function handleCancel() {
    setLoading(true);
    try {
      await cancelBookingRequest(booking!.id, {});
      toast.success("Rendez-vous annulé");
      onUpdated();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Annulation impossible",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete() {
    setLoading(true);
    try {
      await patchBookingStatusRequest(booking!.id, { status: "completed" });
      toast.success("Rendez-vous marqué comme terminé");
      onUpdated();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Mise à jour impossible",
      );
    } finally {
      setLoading(false);
    }
  }

  const canCancel = booking.status === "confirmed" || booking.status === "pending";
  const canComplete = booking.status === "confirmed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-card border-hairline max-w-md">
        <DialogHeader>
          <DialogTitle className="text-title-lg text-on-dark">
            {booking.serviceName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <p className="text-body-md text-body">
            {formatDateTime(booking.startAt)}
          </p>
          <p className="text-body-md text-muted">
            Client :{" "}
            <span className="text-on-dark">
              {booking.clientName ?? booking.prospectName ?? "—"}
            </span>
          </p>
          {booking.prospectEmail ? (
            <p className="text-body-md text-muted">
              Email :{" "}
              <span className="text-on-dark">{booking.prospectEmail}</span>
            </p>
          ) : null}
          <p className="text-body-md text-muted">
            Statut :{" "}
            <span className="text-on-dark capitalize">{booking.status}</span>
          </p>
          <p className="text-body-md text-muted">
            Paiement :{" "}
            <span className="text-on-dark capitalize">
              {booking.paymentStatus}
            </span>
          </p>
          {booking.notes ? (
            <p className="text-body-md text-muted">
              Notes : <span className="text-on-dark">{booking.notes}</span>
            </p>
          ) : null}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {canCancel ? (
            <Button
              variant="outline"
              className="border-hairline"
              disabled={loading}
              onClick={handleCancel}
            >
              Annuler
            </Button>
          ) : null}
          {canComplete ? (
            <Button
              className="bg-primary text-on-primary hover:bg-primary-active"
              disabled={loading}
              onClick={handleComplete}
            >
              Marquer terminé
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
