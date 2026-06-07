import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/tarifs",
  "/find(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health",
  "/api/webhooks(.*)",
  "/_design",
  "/design(.*)",
]);

const isCoachRoute = createRouteMatcher(["/coach(.*)"]);
const isClientRoute = createRouteMatcher(["/client(.*)"]);
const isApiV1Route = createRouteMatcher(["/api/v1(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }

  if (isCoachRoute(req)) {
    await auth.protect();
    const { orgId } = await auth();
    if (!orgId) {
      return Response.redirect(new URL("/sign-in", req.url));
    }
    return;
  }

  if (isClientRoute(req)) {
    await auth.protect();
    return;
  }

  if (isApiV1Route(req)) {
    await auth.protect();
    return;
  }

  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
