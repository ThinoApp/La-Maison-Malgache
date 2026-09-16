/* Homepage-style cinematic wipe for Boutique navigation. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) return;

  const wipe = document.createElement('div');
  wipe.className = 'boutique-section-wipe';
  wipe.setAttribute('aria-hidden','true');
  wipe.innerHTML = '<span class="boutique-section-wipe__panel boutique-section-wipe__panel--top"></span><span class="boutique-section-wipe__panel boutique-section-wipe__panel--bottom"></span><span class="boutique-section-wipe__label"></span>';
  document.body.appendChild(wipe);

  const label = wipe.querySelector('.boutique-section-wipe__label');
  let busy = false;
  let cleanupTimer = 0;

  const destinations = new Map([
    ['#catalogue','Catalogue'],
    ['../#craft','Savoir-faire'],
    ['../#madagascar','Madagascar'],
    ['../','La Maison'],
    ['#top','La Boutique']
  ]);

  function closeVeil(name) {
    if (busy) return false;
    busy = true;
    document.body.classList.add('is-boutique-section-wiping');
    label.textContent = name || 'La Maison';
    wipe.classList.remove('is-revealing');
    wipe.classList.add('is-active');
    requestAnimationFrame(() => wipe.classList.add('is-covering'));
    return true;
  }

  function resetVeil() {
    clearTimeout(cleanupTimer);
    wipe.classList.remove('is-active','is-covering','is-revealing');
    document.body.classList.remove('is-boutique-section-wiping');
    busy = false;
  }

  function revealVeil() {
    wipe.classList.remove('is-covering');
    wipe.classList.add('is-revealing');
    cleanupTimer = window.setTimeout(resetVeil,610);
  }

  function navigateLocal(href,target) {
    window.setTimeout(() => {
      const headerOffset = window.innerWidth <= 700 ? 86 : 126;
      const y = Math.max(0,target.getBoundingClientRect().top + window.scrollY - headerOffset);
      window.scrollTo({top:y,behavior:'auto'});
      history.pushState(null,'',href);
      revealVeil();
    },430);
  }

  function navigateExternal(href,name) {
    try {
      sessionStorage.setItem('lmm-entry-wipe',JSON.stringify({label:name || 'La Maison',href,time:Date.now()}));
    } catch (_) {}
    window.setTimeout(() => { location.href = href; },430);
  }

  document.addEventListener('click',(event) => {
    if (busy || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element ? event.target.closest('.shop-header a,.shop-hero .shop-link[href^="#"]') : null;
    if (!anchor) return;

    const href = anchor.getAttribute('href') || '';
    if (!href) return;

    const isLocal = href.startsWith('#');
    const target = isLocal ? document.querySelector(href) : null;
    if (isLocal && !target) return;

    event.preventDefault();
    const name = destinations.get(href) || anchor.textContent?.trim() || 'La Maison';
    if (!closeVeil(name)) return;

    if (isLocal && target) navigateLocal(href,target);
    else navigateExternal(href,name);
  },true);

  window.addEventListener('pageshow',(event) => {
    if (event.persisted || busy) resetVeil();
  });
})();
