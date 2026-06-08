import { ClientHeader } from "@/components/design/client-header";
import { ClientNav } from "@/components/design/client-nav";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-canvas flex min-h-screen">
      <ClientNav />
      <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <ClientHeader />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
