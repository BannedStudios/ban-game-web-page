import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

// Mapa del sitio para buscadores: páginas públicas + proyectos visibles (los que tienen hidden: true no salen).
// Las páginas de admin (/registro/) y la API quedan fuera; robots.txt apunta aquí.
const SITE = "https://b4nned.xyz";
const PAGES = ["/", "/projects/", "/staff/", "/about/", "/launcher/", "/contact/", "/apply/", "/terms/"];

export const GET: APIRoute = async () => {
  const projects = await getCollection("proyectos", ({ data }) => !data.hidden);
  const slugs = [...new Set(projects.map((p) => p.slug.split("/").slice(1).join("/")))];

  const urls = [
    ...PAGES.map((p) => ({ loc: SITE + p, priority: p === "/" ? "1.0" : p === "/projects/" ? "0.9" : "0.7" })),
    ...slugs.map((s) => ({ loc: `${SITE}/projects/${s}/`, priority: "0.8" })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${encodeURI(u.loc)}</loc><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
};
