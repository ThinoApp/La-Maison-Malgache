/* ObsidianUI-inspired interactions, rewritten for the static Boutique. */
(() => {
  const body = document.body;
  if (!body) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(pointer:fine)');
  const easeClamp = (value, min, max) => Math.min(max, Math.max(min, value));

  /* Magnet Tabs */
  document.querySelectorAll('.universe-tabs button').forEach((button) => {
    if (reduce.matches || !fine.matches) return;
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / Math.max(rect.width, 1)) - .5;
      const ny = ((event.clientY - rect.top) / Math.max(rect.height, 1)) - .5;
      button.style.setProperty('--obs-magnet-x', `${(nx * 7).toFixed(2)}px`);
      button.style.setProperty('--obs-magnet-y', `${(ny * 4).toFixed(2)}px`);
    }, {passive:true});
    button.addEventListener('pointerleave', () => {
      button.style.setProperty('--obs-magnet-x', '0px');
      button.style.setProperty('--obs-magnet-y', '0px');
    }, {passive:true});
  });

  /* Rectangular Text Reveal */
  const rectTargets = [
    document.querySelector('.catalogue-head h2'),
    document.querySelector('.catalogue-note__copy h3')
  ].filter(Boolean);

  rectTargets.forEach((target) => {
    if (target.dataset.obsRect === 'true') return;
    target.dataset.obsRect = 'true';
    target.classList.add('obs-rect-target');
    const content = document.createElement('span');
    content.className = 'obs-rect-content';
    while (target.firstChild) content.appendChild(target.firstChild);
    const sweep = document.createElement('span');
    sweep.className = 'obs-rect-sweep';
    sweep.setAttribute('aria-hidden', 'true');
    target.append(content, sweep);
  });

  if (reduce.matches || !('IntersectionObserver' in window)) {
    rectTargets.forEach((target) => target.classList.add('is-obs-revealed'));
  } else {
    const rectObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-obs-revealed');
        observer.unobserve(entry.target);
      });
    }, {threshold:.34, rootMargin:'0px 0px -8% 0px'});
    rectTargets.forEach((target) => rectObserver.observe(target));
  }

  /* Interactive Blur Reveal on the selected piece. */
  const featuredMedia = document.querySelector('.featured-piece__media');
  const featuredImage = featuredMedia?.querySelector(':scope > img');
  if (featuredMedia && featuredImage && fine.matches && !reduce.matches && !featuredMedia.querySelector('.obs-blur-overlay')) {
    const overlay = featuredImage.cloneNode(false);
    overlay.className = 'obs-blur-overlay';
    overlay.alt = '';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.removeAttribute('fetchpriority');
    overlay.decoding = 'async';
    featuredMedia.appendChild(overlay);

    featuredMedia.addEventListener('pointerenter', () => featuredMedia.classList.add('is-obs-blur-active'), {passive:true});
    featuredMedia.addEventListener('pointermove', (event) => {
      const rect = featuredMedia.getBoundingClientRect();
      const x = easeClamp(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100, 0, 100);
      const y = easeClamp(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100, 0, 100);
      featuredMedia.style.setProperty('--obs-blur-x', `${x.toFixed(2)}%`);
      featuredMedia.style.setProperty('--obs-blur-y', `${y.toFixed(2)}%`);
      featuredMedia.style.setProperty('--obs-blur-radius', `${Math.round(Math.min(rect.width, rect.height) * .22)}px`);
    }, {passive:true});
    featuredMedia.addEventListener('pointerleave', () => featuredMedia.classList.remove('is-obs-blur-active'), {passive:true});
  }

  /* Arrow Fill Button, preserving all existing click handlers and URLs. */
  document.querySelectorAll('.shop-hero .shop-link,.featured-piece .shop-link,.singular-story .shop-link').forEach((control) => {
    if (control.dataset.obsArrow === 'true') return;
    const label = (control.textContent || '').replace(/\s+/g, ' ').trim();
    if (!label) return;
    control.dataset.obsArrow = 'true';
    control.classList.add('obs-arrow-fill');
    control.textContent = '';
    const visible = document.createElement('span');
    visible.className = 'obs-arrow-fill__label';
    visible.textContent = label;
    const overlay = document.createElement('span');
    overlay.className = 'obs-arrow-fill__overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.textContent = label;
    control.append(visible, overlay);
  });

  /* Grid Lift: a lightweight canvas field behind the editorial interlude. */
  function initGridLift() {
    const host = document.querySelector('.catalogue-note__copy');
    if (!host || host.querySelector('.obs-grid-lift')) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'obs-grid-lift';
    canvas.setAttribute('aria-hidden', 'true');
    host.prepend(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maskCanvas = document.createElement('canvas');
    const maskCtx = maskCanvas.getContext('2d', {willReadFrequently:true});
    if (!maskCtx) return;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let maskData = null;
    let raf = 0;
    const pointer = {x:0,y:0,active:false};

    function buildMask() {
      maskCanvas.width = Math.max(1, Math.floor(width));
      maskCanvas.height = Math.max(1, Math.floor(height));
      maskCtx.clearRect(0,0,width,height);
      const size = Math.max(58, Math.min(126, width * .19));
      maskCtx.fillStyle = '#fff';
      maskCtx.font = `700 ${size}px Arial, sans-serif`;
      maskCtx.textAlign = 'center';
      maskCtx.textBaseline = 'middle';
      maskCtx.fillText('GESTE', width * .55, height * .57, width * .9);
      try { maskData = maskCtx.getImageData(0,0,maskCanvas.width,maskCanvas.height).data; }
      catch (_) { maskData = null; }
    }

    function resize() {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      pointer.x = width * .58;
      pointer.y = height * .54;
      buildMask();
      draw();
    }

    function isTextPoint(x,y) {
      if (!maskData) return false;
      const px = easeClamp(Math.floor(x), 0, maskCanvas.width - 1);
      const py = easeClamp(Math.floor(y), 0, maskCanvas.height - 1);
      return maskData[(py * maskCanvas.width + px) * 4 + 3] > 20;
    }

    function draw() {
      raf = 0;
      ctx.clearRect(0,0,width,height);
      const spacing = width < 520 ? 22 : 24;
      const influenceRadius = Math.min(220, Math.max(130, width * .36));
      for (let y = spacing * .5; y < height; y += spacing) {
        for (let x = spacing * .5; x < width; x += spacing) {
          const inside = isTextPoint(x,y);
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx,dy) || 1;
          const influence = pointer.active ? Math.max(0, 1 - distance / influenceRadius) : 0;
          const lift = influence * (inside ? 7 : 2.8);
          const px = x + (dx / distance) * lift;
          const py = y + (dy / distance) * lift;
          const size = 1 + influence * (inside ? 3.8 : 1.6);
          const alpha = (inside ? .105 : .04) + influence * (inside ? .52 : .15);
          ctx.fillStyle = `rgba(232,216,184,${alpha.toFixed(3)})`;
          ctx.fillRect(px - size/2, py - size/2, size, size);
        }
      }
    }

    function schedule() { if (!raf) raf = requestAnimationFrame(draw); }

    if (!reduce.matches && fine.matches) {
      host.addEventListener('pointerenter', (event) => {
        pointer.active = true;
        const rect = host.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        schedule();
      }, {passive:true});
      host.addEventListener('pointermove', (event) => {
        const rect = host.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.active = true;
        schedule();
      }, {passive:true});
      host.addEventListener('pointerleave', () => { pointer.active = false; schedule(); }, {passive:true});
    }

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);
    else window.addEventListener('resize', resize, {passive:true});
    resize();
  }

  initGridLift();
  requestAnimationFrame(() => body.classList.add('shop-obsidian-ready'));
})();
