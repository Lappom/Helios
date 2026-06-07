import { Footer } from "@/components/design/footer";
import { TopNav } from "@/components/design/top-nav";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <TopNav />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
