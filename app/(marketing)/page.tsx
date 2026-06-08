import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FeatureCardTabbed } from "@/components/design/feature-card-tabbed";
import { HeroBand } from "@/components/design/hero-band";

const featureTabs = [
  {
    id: "programs",
    label: "Programmes",
    title: "Construisez des programmes sur mesure",
    description:
      "Templates, périodisation et suivi de charge — tout centralisé pour vos coachs.",
  },
  {
    id: "nutrition",
    label: "Nutrition",
    title: "Plans alimentaires adaptés",
    description:
      "Recettes, macros et habitudes — synchronisés avec les objectifs de vos clients.",
  },
  {
    id: "assessments",
    label: "Bilans",
    title: "Mesurez la progression",
    description:
      "Formulaires, photos et métriques — un historique clair pour chaque client.",
  },
];

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/redirect");
  }

  return (
    <>
      <HeroBand
        title="La plateforme coaching qui scale avec vous"
        subtitle="Programmes, nutrition, bilans et messagerie — un seul espace pour coachs et clients."
        ctaLabel="Commencer"
        ctaHref="/sign-up"
        secondaryLabel="Voir les tarifs"
        secondaryHref="/tarifs"
      />
      <FeatureCardTabbed tabs={featureTabs} />
    </>
  );
}
