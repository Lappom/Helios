import { notFound } from "next/navigation";
import { BookingFlowClient } from "@/components/find/booking-flow-client";
import { getPublicCoachBySlug } from "@/lib/coach-profile/service";

type BookingPageProps = {
  params: Promise<{ slug: string; serviceId: string }>;
};

export async function generateMetadata({ params }: BookingPageProps) {
  const { slug } = await params;

  try {
    const coach = await getPublicCoachBySlug(slug);
    return {
      title: `Réserver — ${coach.displayName} | Helios Find`,
    };
  } catch {
    return { title: "Réservation — Helios Find" };
  }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { slug, serviceId } = await params;

  let coach;
  try {
    coach = await getPublicCoachBySlug(slug);
  } catch {
    notFound();
  }

  const service = coach.services.find((s) => s.id === serviceId);

  if (!service || !service.bookingEnabled) {
    notFound();
  }

  return (
    <BookingFlowClient
      coachSlug={slug}
      coachName={coach.displayName}
      service={service}
    />
  );
}
