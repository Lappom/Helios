import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FindNavProps = {
  className?: string;
};

export function FindNav({ className }: FindNavProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 border-b border-hairline bg-canvas",
        className,
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link href="/find/coaches" className="text-lg font-bold tracking-tight text-on-dark">
          Helios <span className="text-primary">Find</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/find/coaches"
            className="text-sm font-medium text-body hover:text-on-dark"
          >
            Annuaire
          </Link>
          <Button size="sm" className="h-10 px-5 font-semibold" asChild>
            <Link href="/sign-up">Devenir coach</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
