import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrgContext } from "@/lib/auth/org-context";
import { getPostLoginPath } from "@/lib/auth/post-login-redirect";

export default async function RedirectPage() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const context = await getOrgContext();
  const path = getPostLoginPath(context?.role ?? null, Boolean(orgId));

  redirect(path);
}
