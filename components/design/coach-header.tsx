import Link from "next/link";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export function CoachHeader() {
  return (
    <header className="border-hairline flex h-16 shrink-0 items-center justify-between border-b bg-canvas px-6">
      <Link
        href="/coach"
        className="text-lg font-bold tracking-tight text-on-dark md:hidden"
      >
        Helios
      </Link>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        <OrganizationSwitcher
          appearance={{
            elements: {
              rootBox: "flex items-center",
              organizationSwitcherTrigger:
                "border-hairline bg-surface-card text-on-dark text-sm",
            },
          }}
          hidePersonal
        />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-8",
            },
          }}
        />
      </div>
    </header>
  );
}
