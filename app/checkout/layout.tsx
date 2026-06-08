import { Footer } from "@/components/design/footer";
import { FindNav } from "@/components/find/find-nav";

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <FindNav />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
