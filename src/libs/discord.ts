// Aviso en Discord por cada respuesta de los formularios (webhook).
// Variables de entorno (en .env y en Netlify):
//   DISCORD_WEBHOOK_CONTACT  → canal para Contacto
//   DISCORD_WEBHOOK_APPLY    → canal para Postúlate
//   DISCORD_WEBHOOK_FORMS    → canal por defecto si falta alguna de las dos
// Si no hay ninguna, no se envía nada (la respuesta igual queda guardada en Firebase).
import { FORMS } from "../data/forms";

type FormId = 'contact' | 'apply';

// Datos sensibles que no se mandan a Discord (solo se ven en el panel de admin)
const PRIVATE = new Set(['condition']);

const env = (key: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[key] ?? (typeof process !== 'undefined' ? process.env[key] : undefined);

export async function notifyDiscord(form: FormId, data: Record<string, string | string[]>, lang: string, siteUrl: string) {
  const url = env(form === 'contact' ? 'DISCORD_WEBHOOK_CONTACT' : 'DISCORD_WEBHOOK_APPLY') || env('DISCORD_WEBHOOK_FORMS');
  if (!url) return;

  const def = FORMS[form];
  const label = (name: string, v: string) => def.fields.find((f) => f.name === name)?.options?.find((o) => o.value === v)?.label.es ?? v;
  const fields = def.fields
    .filter((f) => !PRIVATE.has(f.name) && data[f.name] !== undefined && data[f.name] !== '')
    .map((f) => {
      const v = data[f.name];
      const value = Array.isArray(v) ? v.map((x) => label(f.name, x)).join(', ') : label(f.name, v);
      const long = f.type === 'textarea';
      return { name: f.label.es, value: value.length > 1000 ? value.slice(0, 1000) + '…' : value, inline: !long };
    });

  const who = String(data.name || data.discord || data.email || 'Sin nombre');
  const body = {
    username: 'Banned Studios · Web',
    allowed_mentions: { parse: [] },   // nunca menciona a nadie aunque el texto lleve @everyone
    embeds: [{
      title: form === 'contact' ? `Nuevo mensaje de contacto · ${who}` : `Nueva postulación · ${who}`,
      url: `${siteUrl}/registro/formularios/?f=${form}`,
      color: 0xF0B83A,
      fields: fields.slice(0, 25),
      footer: { text: `${form === 'contact' ? 'Contacto' : 'Postúlate'} · ${lang.toUpperCase()} · Ver en el panel de admin` },
      timestamp: new Date().toISOString(),
    }],
  };

  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) console.error('[discord] El webhook respondió', res.status);
  } catch (e) {
    console.error('[discord] No se pudo enviar el aviso', e);
  }
}
