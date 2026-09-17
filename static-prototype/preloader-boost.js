/* Visual preloader orchestrator. Enhances the existing loader without owning loading semantics. */
(() => {
  const loader = document.querySelector('.site-preloader');
  if (!loader) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(pointer:fine) and (hover:hover)');
  const heroImage = document.querySelector('.portal img');
  let pointerRaf = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let handoffReady = false;

  if (!reduce.matches && heroImage) {
    const handoff = document.createElement('div');
    handoff.className = 'preloader-handoff';
    handoff.setAttribute('aria-hidden', 'true');
    const handoffImage = document.createElement('img');
    handoffImage.alt = '';
    handoffImage.decoding = 'async';
    handoffImage.src = heroImage.currentSrc || heroImage.src;
    handoff.appendChild(handoffImage);
    loader.insertBefore(handoff, loader.firstChild);
    handoffReady = true;
  }

  function applyProgress(progress, percent = Math.round(progress * 100)) {
    if (!loader.isConnected) return;
    const safe = Math.max(0, Math.min(1, Number(progress) || 0));
    const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));

    loader.dataset.progress = String(safePercent).padStart(2, '0');
    loader.style.setProperty('--preload-percent', `${safePercent}%`);
    loader.classList.toggle('phase-brand', safe >= .12 && safe < .42);
    loader.classList.toggle('phase-portal', safe >= .42 && safe < .88);
    loader.classList.toggle('phase-ready', safe >= .88);
    if (safe >= .94 && handoffReady) loader.classList.add('handoff-armed');
  }

  function readInitialProgress() {
    const dataValue = Number.parseFloat(loader.dataset.progressValue || '');
    if (Number.isFinite(dataValue)) {
      applyProgress(dataValue);
      return;
    }
    const raw = getComputedStyle(loader).getPropertyValue('--preload-progress').trim();
    applyProgress(Number.parseFloat(raw) || 0);
  }

  const onProgress = (event) => {
    const detail = event.detail || {};
    applyProgress(detail.progress, detail.percent);
  };
  window.addEventListener('lmm:preload-progress', onProgress);

  if (!reduce.matches && fine.matches) {
    const updatePointer = () => {
      pointerRaf = 0;
      if (!loader.isConnected || document.hidden) return;
      currentX += (targetX - currentX) * .08;
      currentY += (targetY - currentY) * .08;
      loader.style.setProperty('--preload-x', `${currentX.toFixed(2)}px`);
      loader.style.setProperty('--preload-y', `${currentY.toFixed(2)}px`);
      if (Math.abs(targetX - currentX) > .05 || Math.abs(targetY - currentY) > .05) {
        pointerRaf = requestAnimationFrame(updatePointer);
      }
    };

    window.addEventListener('pointermove', (event) => {
      if (!loader.isConnected || document.hidden) return;
      const nx = event.clientX / Math.max(1, innerWidth) - .5;
      const ny = event.clientY / Math.max(1, innerHeight) - .5;
      targetX = nx * 22;
      targetY = ny * 16;
      if (!pointerRaf) pointerRaf = requestAnimationFrame(updatePointer);
    }, { passive:true });
  }

  const exitObserver = new MutationObserver(() => {
    if (!loader.classList.contains('is-leaving')) return;
    cancelAnimationFrame(pointerRaf);
    pointerRaf = 0;
    loader.classList.add('phase-ready', 'handoff-armed');
    window.removeEventListener('lmm:preload-progress', onProgress);

    document.body.classList.add('hero-handoff');
    requestAnimationFrame(() => document.body.classList.add('hero-handoff-visible'));

    window.setTimeout(() => {
      document.body.classList.remove('hero-handoff', 'hero-handoff-visible');
    }, 1180);

    exitObserver.disconnect();
  });
  exitObserver.observe(loader, { attributes:true, attributeFilter:['class'] });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    cancelAnimationFrame(pointerRaf);
    pointerRaf = 0;
  });

  readInitialProgress();
})();
