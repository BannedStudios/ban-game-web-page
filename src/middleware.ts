import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const isAdminProtected = createRouteMatcher(["/registro", "/registro/(.*)"]);
const isStaffApi = createRouteMatcher(["/api/staff"]);
const isFormsApi = createRouteMatcher(["/api/forms"]);

// Métodos que solo leen: la API de staff los deja libres (la portada y /staff los usan)
const READ_ONLY = new Set(["GET", "HEAD", "OPTIONS"]);

const json = (body: object, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export const onRequest = clerkMiddleware((auth, context) => {
  const { userId, redirectToSignIn, sessionClaims } = auth();
  const isAdmin = sessionClaims?.metadata?.role === "admin";

  if (isAdminProtected(context.request)) {
    if (!userId) return redirectToSignIn();

    if (!isAdmin) return new Response("Unauthorized", { status: 401 });
  }

  // Crear, editar o borrar staff (POST, PUT, DELETE) exige sesión con rol admin
  if (isStaffApi(context.request) && !READ_ONLY.has(context.request.method)) {
    if (!userId) return json({ error: "No has iniciado sesión" }, 401);

    if (!isAdmin) return json({ error: "No tienes permiso" }, 403);
  }

  // Formularios: enviar (POST) es público; leer, marcar o borrar respuestas solo para admin
  if (isFormsApi(context.request) && context.request.method !== "POST") {
    if (!userId) return json({ error: "No has iniciado sesión" }, 401);

    if (!isAdmin) return json({ error: "No tienes permiso" }, 403);
  }
});

