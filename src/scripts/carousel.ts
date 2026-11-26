// Carrusel de videos/galería, común a la portada y a la página de cada proyecto.
// Marcado: un contenedor [data-carousel-root] con la fila [data-carousel] (data-gap = separación en px)
// y los botones [data-carousel-prev] / [data-carousel-next].
// Se engancha en "astro:page-load" (carga inicial y cada navegación con ClientRouter) y marca cada carrusel
// como listo para no duplicar eventos al volver a una página.

function setup(root: HTMLElement) {
  if (root.dataset.ready) return;
  root.dataset.ready = '1';

  const row = root.querySelector<HTMLElement>('[data-carousel]');
  const prev = root.querySelector<HTMLElement>('[data-carousel-prev]');
  const next = root.querySelector<HTMLElement>('[data-carousel-next]');
  if (!row) return;
  const gap = Number(row.dataset.gap) || 0;
  const items = Array.from(row.children) as HTMLElement[];
  if (!items.length) return;

  // Ancho de cada elemento en píxeles enteros (las clases dan cuántos van por fila)
  const fit = () => {
    if (!row.isConnected) { window.removeEventListener('resize', fit); return; }
    items.forEach((el) => (el.style.width = ''));
    const n = Math.max(1, Math.round((row.clientWidth + gap) / (items[0].getBoundingClientRect().width + gap)));
    const w = Math.floor((row.clientWidth - gap * (n - 1)) / n);
    items.forEach((el) => (el.style.width = w + 'px'));
  };
  fit();
  window.addEventListener('resize', fit);

  const step = () => items[0].offsetWidth + gap;
  next?.addEventListener('click', () => row.scrollBy({ left: step(), behavior: 'smooth' }));
  prev?.addEventListener('click', () => row.scrollBy({ left: -step(), behavior: 'smooth' }));
}

document.addEventListener('astro:page-load', () => {
  document.querySelectorAll<HTMLElement>('[data-carousel-root]').forEach(setup);
});
