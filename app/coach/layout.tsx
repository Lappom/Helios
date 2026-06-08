import { CoachAiChatTrigger } from "@/components/coach/ai/coach-ai-chat-trigger";
import { CoachHeader } from "@/components/design/coach-header";
import { CoachSidebar } from "@/components/design/coach-sidebar";

export default function CoachLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-canvas flex min-h-screen">
      <CoachSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CoachHeader />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
      <CoachAiChatTrigger />
    </div>
  );
}
