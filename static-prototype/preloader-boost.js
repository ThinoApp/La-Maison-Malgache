/* Visual preloader orchestrator. Reads the existing progress without changing loading semantics. */
(() => {
  const loader = document.querySelector('.site-preloader');
  if (!loader) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer:fine)').matches;
  let raf = 0;
  let pointerRaf = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let lastPercent = -1;

  function readProgress() {
    const raw = getComputedStyle(loader).getPropertyValue('--preload-progress').trim();
    const progress = Math.max(0, Math.min(1, Number.parseFloat(raw) || 0));
    const percent = Math.round(progress * 100);

    if (percent !== lastPercent) {
      lastPercent = percent;
      loader.dataset.progress = String(percent).padStart(2, '0');
      loader.style.setProperty('--preload-percent', `${percent}%`);
    }

    loader.classList.toggle('phase-brand', progress >= .12 && progress < .42);
    loader.classList.toggle('phase-portal', progress >= .42 && progress < .88);
    loader.classList.toggle('phase-ready', progress >= .88);

    if (loader.isConnected && !loader.classList.contains('is-leaving')) {
      raf = requestAnimationFrame(readProgress);
    }
  }

  if (!reduce && fine) {
    const updatePointer = () => {
      pointerRaf = 0;
      currentX += (targetX - currentX) * .08;
      currentY += (targetY - currentY) * .08;
      loader.style.setProperty('--preload-x', `${currentX.toFixed(2)}px`);
      loader.style.setProperty('--preload-y', `${currentY.toFixed(2)}px`);
      if (Math.abs(targetX - currentX) > .05 || Math.abs(targetY - currentY) > .05) {
        pointerRaf = requestAnimationFrame(updatePointer);
      }
    };

    window.addEventListener('pointermove', (event) => {
      const nx = event.clientX / Math.max(1, innerWidth) - .5;
      const ny = event.clientY / Math.max(1, innerHeight) - .5;
      targetX = nx * 22;
      targetY = ny * 16;
      if (!pointerRaf) pointerRaf = requestAnimationFrame(updatePointer);
    }, { passive: true });
  }

  const exitObserver = new MutationObserver(() => {
    if (!loader.classList.contains('is-leaving')) return;
    cancelAnimationFrame(raf);
    cancelAnimationFrame(pointerRaf);
    loader.classList.add('phase-ready');
    exitObserver.disconnect();
  });
  exitObserver.observe(loader, { attributes:true, attributeFilter:['class'] });

  readProgress();
})();
