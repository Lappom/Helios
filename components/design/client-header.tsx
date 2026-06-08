import { UserButton } from "@clerk/nextjs";

export function ClientHeader() {
  return (
    <header className="border-hairline flex h-16 shrink-0 items-center justify-between border-b bg-canvas px-6">
      <p className="text-lg font-bold tracking-tight text-on-dark md:hidden">
        Mon espace
      </p>
      <div className="hidden md:block" />
      <UserButton
        appearance={{
          elements: {
            avatarBox: "size-8",
          },
        }}
      />
    </header>
  );
}
