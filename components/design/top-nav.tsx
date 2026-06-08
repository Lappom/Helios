import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#", label: "Produit" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "#", label: "Ressources" },
  { href: "#", label: "Clients" },
];

type TopNavProps = {
  className?: string;
};

export async function TopNav({ className }: TopNavProps) {
  const { userId } = await auth();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 border-b border-hairline bg-canvas",
        className,
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-on-dark">
          Helios
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-body hover:text-on-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {userId ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-body hover:text-on-dark"
                asChild
              >
                <Link href="/redirect">Dashboard</Link>
              </Button>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-8",
                  },
                }}
              />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-body hover:text-on-dark"
                asChild
              >
                <Link href="/sign-in">Connexion</Link>
              </Button>
              <Button size="lg" className="h-10 px-5 font-semibold" asChild>
                <Link href="/sign-up">Commencer</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
