// Datos públicos de un tweet desde el servicio de "syndication" de X (el mismo que usan los embeds),
// para pintarlo con el estilo de la marca en vez del widget oficial. Se guarda 15 min en memoria.

export interface TweetData {
  id: string;
  url: string;
  name: string;
  handle: string;
  avatar: string;
  html: string;          // texto con enlaces, menciones y hashtags ya enlazados (escapado)
  date: string;          // ISO
  likes: number;
  replies: number;
  media: { type: 'photo' | 'video'; src: string; w?: number; h?: number }[];
}

const cache = new Map<string, { at: number; data: TweetData | null }>();
const TTL = 15 * 60 * 1000;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const tweetId = (src: string) => (src.match(/status\/(\d+)/) || src.match(/^(\d+)$/))?.[1] ?? '';

export async function getTweet(src: string): Promise<TweetData | null> {
  const id = tweetId(src);
  if (!id) return null;
  const hit = cache.get(id);
  if (hit && Date.now() - hit.at < TTL) return hit.data;

  let data: TweetData | null = null;
  try {
    const token = ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');
    const res = await fetch(`https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=es&token=${token}`);
    if (res.ok) {
      const j: any = await res.json();
      // Tweet borrado o no disponible (TweetTombstone, sin autor): se omite
      if (j.__typename === 'TweetTombstone' || !j.user) { cache.set(id, { at: Date.now(), data: null }); return null; }
      const handle = j.user?.screen_name ?? '';

      // Texto: quita el enlace corto de la imagen/vídeo, cambia los t.co por la URL real y enlaza @ y #
      let text: string = j.text ?? '';
      for (const m of j.entities?.media ?? []) text = text.replace(m.url, '');
      let html = esc(text.trim());
      for (const u of j.entities?.urls ?? []) {
        html = html.replace(esc(u.url), `<a href="${esc(u.expanded_url)}" target="_blank" rel="noopener noreferrer">${esc(u.display_url)}</a>`);
      }
      html = html
        .replace(/(^|[^\w])@(\w{1,15})/g, '$1<a href="https://x.com/$2" target="_blank" rel="noopener noreferrer">@$2</a>')
        .replace(/(^|[^\w&])#([\p{L}\p{N}_]+)/gu, '$1<a href="https://x.com/hashtag/$2" target="_blank" rel="noopener noreferrer">#$2</a>')
        .replace(/\n/g, '<br>');

      const media: TweetData['media'] = [];
      for (const m of j.mediaDetails ?? []) {
        if (m.type === 'photo') media.push({ type: 'photo', src: m.media_url_https, w: m.original_info?.width, h: m.original_info?.height });
        else media.push({ type: 'video', src: m.media_url_https, w: m.original_info?.width, h: m.original_info?.height });
      }

      data = {
        id,
        url: `https://x.com/${handle}/status/${id}`,
        name: j.user?.name ?? handle,
        handle,
        avatar: (j.user?.profile_image_url_https ?? '').replace('_normal.', '_200x200.'),
        html,
        date: j.created_at,
        likes: j.favorite_count ?? 0,
        replies: j.conversation_count ?? 0,
        media: media.slice(0, 4),
      };
    }
  } catch (e) {
    console.error('[tweets] No se pudo cargar el tweet', id, e);
  }
  cache.set(id, { at: Date.now(), data });
  return data;
}
