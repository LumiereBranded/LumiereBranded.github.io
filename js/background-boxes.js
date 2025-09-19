/* Full-viewport grid, each square lights up (entire tile) on hover.
   Vanilla JS, no frameworks. */

(function () {
  const SEC_ID = 'bg-boxes';

  function buildGrid() {
    const sec = document.getElementById(SEC_ID);
    if (!sec) return;

    let boxes = sec.querySelector('.boxes');
    if (!boxes) {
      boxes = document.createElement('div');
      boxes.className = 'boxes';
      sec.appendChild(boxes);
    }

    // Clear and rebuild to fit current viewport
    boxes.innerHTML = '';

    // Read square size from CSS custom property
    const bbSizeRaw = getComputedStyle(document.documentElement).getPropertyValue('--bb-size').trim();
    const size = parseInt(bbSizeRaw, 10) || 40;

    const cols = Math.ceil(window.innerWidth / size);
    const rows = Math.ceil(window.innerHeight / size);
    const total = cols * rows;

    const frag = document.createDocumentFragment();

    for (let i = 0; i < total; i++) {
      const tile = document.createElement('div');
      tile.className = 'box';

      // assign a stable base hue per tile
      const baseHue = Math.floor(Math.random() * 360);
      tile.style.setProperty('--h', baseHue.toString());

      // nudge hue a bit when entering so repeated hovers feel alive
      tile.addEventListener('mouseenter', () => {
        const h = (parseInt(tile.style.getPropertyValue('--h') || '210', 10) + (Math.random() * 40 - 20) + 360) % 360;
        tile.style.setProperty('--h', Math.round(h).toString());
      });

      frag.appendChild(tile);
    }

    boxes.appendChild(frag);

    // ensure only the edge mask exists (optional)
    if (!sec.querySelector('.edge-mask')) {
      const em = document.createElement('div');
      em.className = 'edge-mask';
      em.setAttribute('aria-hidden', 'true');
      sec.appendChild(em);
    }
  }

  // Build on load and on resize
  window.addEventListener('resize', buildGrid, { passive: true });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildGrid);
  } else {
    buildGrid();
  }
})();
