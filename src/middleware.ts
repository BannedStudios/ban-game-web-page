import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const isAdminProtected = createRouteMatcher(["/registro/staff"]);

export const onRequest = clerkMiddleware((auth, context) => {
  const { userId, redirectToSignIn, sessionClaims } = auth();

  if (isAdminProtected(context.request)) {
    if (!userId) return redirectToSignIn();

    if (sessionClaims?.metadata.role !== "admin") return new Response("Unauthorized", { status: 401 });
  }
});