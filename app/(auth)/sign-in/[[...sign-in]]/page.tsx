import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk/appearance";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 py-12">
      <SignIn appearance={clerkAppearance} forceRedirectUrl="/redirect" />
    </main>
  );
}
