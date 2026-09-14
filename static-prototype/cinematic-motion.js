/* Extreme cinematic motion physics. Concatenated after the main motion layer. */
if (!reduceMotion.matches) {
  const cinematicStyle = document.createElement('link');
  cinematicStyle.rel = 'stylesheet';
  cinematicStyle.href = 'cinematic-motion.css';
  document.head.appendChild(cinematicStyle);

  const velocityLens = document.createElement('div');
  velocityLens.className = 'velocity-lens';
  velocityLens.setAttribute('aria-hidden', 'true');
  velocityLens.innerHTML = '<span class="velocity-lens__band"></span><span class="velocity-lens__band"></span><span class="velocity-lens__band"></span>';
  document.body.appendChild(velocityLens);

  const sceneBloom = document.createElement('div');
  sceneBloom.className = 'scene-bloom';
  sceneBloom.setAttribute('aria-hidden', 'true');
  document.body.appendChild(sceneBloom);

  const wipe = document.createElement('div');
  wipe.className = 'cinematic-wipe';
  wipe.setAttribute('aria-hidden', 'true');
  wipe.innerHTML = '<span class="cinematic-wipe__panel cinematic-wipe__panel--top"></span><span class="cinematic-wipe__panel cinematic-wipe__panel--bottom"></span><span class="cinematic-wipe__label"></span>';
  document.body.appendChild(wipe);
  const wipeLabel = wipe.querySelector('.cinematic-wipe__label');

  if (finePointer.matches) {
    let targetDepthX = 0;
    let targetDepthY = 0;
    let depthX = 0;
    let depthY = 0;
    let depthRaf = 0;
    let pointerEnergyTimer = 0;

    const updateDepthVars = () => {
      depthRaf = 0;
      depthX += (targetDepthX - depthX) * .09;
      depthY += (targetDepthY - depthY) * .09;

      const root = document.documentElement.style;
      root.setProperty('--depth-x', `${depthX.toFixed(2)}px`);
      root.setProperty('--depth-y', `${depthY.toFixed(2)}px`);
      root.setProperty('--depth-x-inverse', `${(-depthX * .58).toFixed(2)}px`);
      root.setProperty('--depth-y-inverse', `${(-depthY * .58).toFixed(2)}px`);
      root.setProperty('--depth-x-soft', `${(depthX * .55).toFixed(2)}px`);
      root.setProperty('--depth-y-soft', `${(depthY * .55).toFixed(2)}px`);
      root.setProperty('--depth-x-story', `${(depthX * .34).toFixed(2)}px`);
      root.setProperty('--depth-y-story', `${(depthY * .34).toFixed(2)}px`);
      root.setProperty('--depth-x-territory', `${(depthX * .24).toFixed(2)}px`);
      root.setProperty('--depth-y-territory', `${(depthY * .24).toFixed(2)}px`);
      root.setProperty('--depth-x-copy', `${(-depthX * .22).toFixed(2)}px`);
      root.setProperty('--depth-y-copy', `${(-depthY * .22).toFixed(2)}px`);

      if (Math.abs(targetDepthX - depthX) > .05 || Math.abs(targetDepthY - depthY) > .05) {
        depthRaf = requestAnimationFrame(updateDepthVars);
      }
    };

    window.addEventListener('pointermove', (event) => {
      const nx = event.clientX / Math.max(1, window.innerWidth) - .5;
      const ny = event.clientY / Math.max(1, window.innerHeight) - .5;
      targetDepthX = nx * 15;
      targetDepthY = ny * 11;
      if (!depthRaf) depthRaf = requestAnimationFrame(updateDepthVars);

      document.body.classList.add('has-pointer-energy');
      clearTimeout(pointerEnergyTimer);
      pointerEnergyTimer = window.setTimeout(() => document.body.classList.remove('has-pointer-energy'), 110);
    }, { passive: true });

    document.addEventListener('pointerout', (event) => {
      if (event.relatedTarget) return;
      targetDepthX = 0;
      targetDepthY = 0;
      if (!depthRaf) depthRaf = requestAnimationFrame(updateDepthVars);
    });
  }

  let lastScrollY = window.scrollY;
  let lastScrollTime = performance.now();
  let targetBlur = 0;
  let targetOffset = 0;
  let targetOpacity = 0;
  let currentBlur = 0;
  let currentOffset = 0;
  let currentOpacity = 0;
  let lensRaf = 0;
  let settleTimer = 0;

  const animateVelocityLens = () => {
    lensRaf = 0;
    currentBlur += (targetBlur - currentBlur) * .17;
    currentOffset += (targetOffset - currentOffset) * .18;
    currentOpacity += (targetOpacity - currentOpacity) * .2;

    const root = document.documentElement.style;
    root.setProperty('--velocity-blur', `${currentBlur.toFixed(2)}px`);
    root.setProperty('--velocity-offset', `${currentOffset.toFixed(2)}px`);
    root.setProperty('--velocity-opacity', currentOpacity.toFixed(3));

    const active = Math.abs(currentBlur - targetBlur) > .02 || Math.abs(currentOffset - targetOffset) > .08 || Math.abs(currentOpacity - targetOpacity) > .01;
    if (active) lensRaf = requestAnimationFrame(animateVelocityLens);
  };

  const requestLens = () => {
    if (!lensRaf) lensRaf = requestAnimationFrame(animateVelocityLens);
  };

  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 1000) return;
    const now = performance.now();
    const y = window.scrollY;
    const dt = Math.max(16, now - lastScrollTime);
    const velocity = (y - lastScrollY) / dt * 16.67;
    const absVelocity = Math.abs(velocity);

    targetBlur = Math.min(3.2, Math.max(0, absVelocity - 4) * .07);
    targetOffset = Math.max(-26, Math.min(26, velocity * .72));
    targetOpacity = Math.min(.34, Math.max(0, absVelocity - 5) / 65);
    requestLens();

    clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      targetBlur = 0;
      targetOffset = 0;
      targetOpacity = 0;
      requestLens();
    }, 80);

    lastScrollY = y;
    lastScrollTime = now;
  }, { passive: true });

  const majorScenes = [...document.querySelectorAll('#craft,#madagascar')];
  let lastBloomId = '';
  if ('IntersectionObserver' in window && majorScenes.length) {
    const bloomObserver = new IntersectionObserver((entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active || active.target.id === lastBloomId) return;
      lastBloomId = active.target.id;
      sceneBloom.classList.remove('is-active');
      void sceneBloom.offsetWidth;
      sceneBloom.classList.add('is-active');
      window.setTimeout(() => sceneBloom.classList.remove('is-active'), 920);
    }, { threshold: [.28, .48] });
    majorScenes.forEach((section) => bloomObserver.observe(section));
  }

  const anchorLabels = new Map([
    ['#top', 'Entrée'],
    ['#story', 'La Maison'],
    ['#storytelling', 'Matière'],
    ['#universes', 'Collections'],
    ['#craft', 'Savoir-faire'],
    ['#madagascar', 'Madagascar'],
    ['#closing', 'Transmission']
  ]);
  let wipeBusy = false;

  document.addEventListener('click', (event) => {
    if (wipeBusy || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    wipeBusy = true;
    wipeLabel.textContent = anchorLabels.get(href) || 'La Maison';
    wipe.classList.remove('is-revealing');
    wipe.classList.add('is-active');
    requestAnimationFrame(() => wipe.classList.add('is-covering'));

    window.setTimeout(() => {
      const y = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: 'auto' });
      history.pushState(null, '', href);
      wipe.classList.remove('is-covering');
      wipe.classList.add('is-revealing');
    }, 430);

    window.setTimeout(() => {
      wipe.classList.remove('is-active', 'is-revealing');
      wipeBusy = false;
    }, 1040);
  });
}
