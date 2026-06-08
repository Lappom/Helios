"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  cancelBookingRequest,
  fetchClientBookings,
} from "@/lib/bookings/api-client";
import type { BookingListItem } from "@/lib/bookings/types";

type ClientBookingsPageProps = {
  initialBookings: BookingListItem[];
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

export function ClientBookingsPage({
  initialBookings,
}: ClientBookingsPageProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function refresh() {
    const items = await fetchClientBookings();
    setBookings(items);
  }

  async function handleCancel(bookingId: string) {
    setLoadingId(bookingId);
    try {
      await cancelBookingRequest(bookingId, {});
      toast.success("Rendez-vous annulé");
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Annulation impossible",
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
          Mes rendez-vous
        </h1>
        <p className="text-body-md text-muted mt-2">
          Consultez et gérez vos prochains rendez-vous.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="border-hairline bg-surface-card rounded-lg border p-8 text-center">
          <p className="text-body-md text-muted">
            Aucun rendez-vous à venir.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="border-hairline bg-surface-card rounded-lg border p-5"
            >
              <h2 className="text-title-sm text-on-dark font-semibold">
                {booking.serviceName}
              </h2>
              <p className="text-body-md text-muted mt-1">
                {formatDateTime(booking.startAt)}
              </p>
              <p className="text-body-sm text-muted mt-2 capitalize">
                Statut : {booking.status}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-hairline mt-4"
                disabled={loadingId === booking.id}
                onClick={() => handleCancel(booking.id)}
              >
                Annuler
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
