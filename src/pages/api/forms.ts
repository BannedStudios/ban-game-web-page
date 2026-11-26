import type { APIRoute } from "astro";
import { FORMS, validate, type Lang } from "../../data/forms";
import { addSubmission, listSubmissions, setRead, deleteSubmission, type FormId } from "../../libs/firestore/forms";
import { notifyDiscord } from "../../libs/discord";

// POST es público (lo usan Contacto y Postúlate). GET, PATCH y DELETE solo para admin (lo comprueba middleware.ts).

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

// Límite sencillo contra envíos masivos: 5 envíos por IP cada 10 minutos (por instancia del servidor)
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
function tooMany(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ error: "Bad request" }, 400); }

  const lang: Lang = body.lang === "en" ? "en" : "es";
  const form = FORMS[body.form as FormId];
  if (!form) return json({ error: "Bad request" }, 400);

  // Trampas para bots: campo oculto que una persona deja vacío y envío demasiado rápido (menos de 3 s)
  const startedAt = Number(body.startedAt);
  if (body.website || !startedAt || Date.now() - startedAt < 3000) return json({ ok: true });

  const ip = request.headers.get("x-nf-client-connection-ip") || clientAddress || "unknown";
  if (tooMany(ip)) return json({ error: lang === "es" ? "Has enviado demasiados formularios. Prueba más tarde." : "Too many submissions. Try again later." }, 429);

  const { data, error } = validate(form, (body.data ?? {}) as Record<string, unknown>, lang);
  if (error || !data) return json({ error }, 400);

  try {
    await addSubmission(form.id, data, lang);
    // Aviso en Discord (si hay webhook configurado); si falla no afecta al envío
    await notifyDiscord(form.id, data, lang, new URL(request.url).origin);
    return json({ ok: true }, 201);
  } catch (err) {
    console.error(err);
    return json({ error: lang === "es" ? "No se pudo enviar. Inténtalo de nuevo." : "Could not send. Please try again." }, 500);
  }
};

export const GET: APIRoute = async ({ url }) => {
  const form = url.searchParams.get("form") as FormId | null;
  return json(await listSubmissions(form && FORMS[form] ? form : undefined));
};

export const PATCH: APIRoute = async ({ request }) => {
  const { id, read } = await request.json().catch(() => ({}));
  if (typeof id !== "string") return json({ error: "Falta el id" }, 400);
  return json(await setRead(id, !!read));
};

export const DELETE: APIRoute = async ({ request }) => {
  const { id } = await request.json().catch(() => ({}));
  if (typeof id !== "string") return json({ error: "Falta el id" }, 400);
  return json(await deleteSubmission(id));
};
