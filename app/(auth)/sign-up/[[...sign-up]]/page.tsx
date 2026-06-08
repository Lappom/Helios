import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk/appearance";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 py-12">
      <SignUp appearance={clerkAppearance} forceRedirectUrl="/redirect" />
    </main>
  );
}
