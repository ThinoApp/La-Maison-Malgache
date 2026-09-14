const storytellingStyles = document.createElement('link');
storytellingStyles.rel = 'stylesheet';
storytellingStyles.href = 'storytelling.css';
document.head.appendChild(storytellingStyles);

const madagascarStyles = document.createElement('link');
madagascarStyles.rel = 'stylesheet';
madagascarStyles.href = 'madagascar-motion.css';
document.head.appendChild(madagascarStyles);

const surfaceStyles = document.createElement('link');
surfaceStyles.rel = 'stylesheet';
surfaceStyles.href = 'surface-motion.css';
document.head.appendChild(surfaceStyles);

const bridgeStyles = document.createElement('link');
bridgeStyles.rel = 'stylesheet';
bridgeStyles.href = 'bridge-motion.css';
document.head.appendChild(bridgeStyles);

const globalMotionStyles = document.createElement('link');
globalMotionStyles.rel = 'stylesheet';
globalMotionStyles.href = 'global-motion.css';
document.head.appendChild(globalMotionStyles);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer:fine)');

const preloader = document.querySelector('.site-preloader');
const heroImage = document.querySelector('.portal img');
const preloadStart = performance.now();
const preloadMin = reduceMotion.matches ? 180 : 900;
const preloadMax = reduceMotion.matches ? 900 : 2800;
let preloadFinished = false;
let preloadProgress = 0.08;
let preloadTicker = 0;

function setPreloadProgress(value) {
  preloadProgress = Math.max(preloadProgress, Math.min(value, 1));
  if (preloader) preloader.style.setProperty('--preload-progress', String(preloadProgress));
}

function animatePreloadProgress() {
  if (preloadFinished || !preloader) return;
  const elapsed = performance.now() - preloadStart;
  const target = elapsed < 600 ? 0.46 : elapsed < 1200 ? 0.72 : 0.86;
  setPreloadProgress(preloadProgress + (target - preloadProgress) * 0.08);
  preloadTicker = requestAnimationFrame(animatePreloadProgress);
}

function finishPreloader() {
  if (preloadFinished) return;
  preloadFinished = true;
  cancelAnimationFrame(preloadTicker);
  setPreloadProgress(1);

  const elapsed = performance.now() - preloadStart;
  const wait = Math.max(0, preloadMin - elapsed);

  window.setTimeout(() => {
    document.body.classList.add('ready');
    document.body.dataset.loading = 'false';

    if (!preloader) return;
    preloader.classList.add('is-leaving');
    window.setTimeout(() => preloader.remove(), reduceMotion.matches ? 180 : 980);
  }, wait);
}

if (preloader) {
  document.body.dataset.loading = 'true';
  animatePreloadProgress();

  if (!heroImage || heroImage.complete) {
    finishPreloader();
  } else {
    heroImage.addEventListener('load', finishPreloader, { once: true });
    heroImage.addEventListener('error', finishPreloader, { once: true });
  }

  window.setTimeout(finishPreloader, preloadMax);
} else {
  document.body.classList.add('ready');
  document.body.dataset.loading = 'false';
}

function revealImmediately() {
  document.querySelectorAll('.reveal,.line-reveal,.mask-reveal,.craft .item,.closing').forEach((el) => el.classList.add('is-visible'));
}

if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  revealImmediately();
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal,.line-reveal,.mask-reveal,.craft .item,.closing').forEach((el) => revealObserver.observe(el));
}

const storytelling = document.querySelector('.storytelling');
const storyMedia = document.querySelector('.story-media');
const storyPhotos = [...document.querySelectorAll('.story-photo')];
const storyPanels = [...document.querySelectorAll('.story-copy-panel')];
const storyBars = [...document.querySelectorAll('.story-progress span')];
const storySentinels = [...document.querySelectorAll('.story-sentinel')];
const storyWords = ['Objet', 'Matière', 'Geste', 'Territoire'];
let currentStoryStep = 0;
let storyWordTimer;

function setStoryStep(index) {
  if (!storytelling || !storyMedia) return;
  const safeIndex = Math.max(0, Math.min(index, storyPhotos.length - 1));
  const changed = safeIndex !== currentStoryStep;
  currentStoryStep = safeIndex;

  storytelling.dataset.activeStep = String(safeIndex);
  storytelling.style.setProperty('--story-progress', String((safeIndex + 1) / storyPhotos.length));

  storyPhotos.forEach((el, i) => el.classList.toggle('is-active', i === safeIndex));
  storyPanels.forEach((el, i) => el.classList.toggle('is-active', i === safeIndex));
  storyBars.forEach((el, i) => el.classList.toggle('is-active', i <= safeIndex));

  if (changed && !reduceMotion.matches) {
    storyMedia.classList.add('is-switching');
    clearTimeout(storyWordTimer);
    storyWordTimer = setTimeout(() => {
      storyMedia.dataset.word = storyWords[safeIndex];
      storyMedia.classList.remove('is-switching');
    }, 190);
  } else {
    storyMedia.dataset.word = storyWords[safeIndex];
  }
}

setStoryStep(0);

if (!reduceMotion.matches && 'IntersectionObserver' in window && storySentinels.length) {
  const storyObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
    if (!visible.length) return;
    const index = Number(visible[0].target.dataset.step || 0);
    setStoryStep(index);
  }, { rootMargin: '-44% 0px -44% 0px', threshold: 0 });

  storySentinels.forEach((sentinel) => storyObserver.observe(sentinel));
}

const sceneSections = [...document.querySelectorAll('[data-scene]')];
const sceneNames = new Map([
  ['top', 'Entrée'],
  ['story', 'La Maison'],
  ['storytelling', 'Objet · Matière'],
  ['universes', 'Collections'],
  ['craft', 'Savoir-faire'],
  ['madagascar', 'Territoire'],
  ['closing', 'Transmission']
]);
let activeSceneName = 'Entrée';

function pulseScene() {
  if (reduceMotion.matches) return;
  document.body.classList.remove('scene-pulse');
  void document.body.offsetWidth;
  document.body.classList.add('scene-pulse');
  window.setTimeout(() => document.body.classList.remove('scene-pulse'), 420);
}

function updateSceneLabels(name) {
  if (!name || name === activeSceneName) return;
  activeSceneName = name;
  document.querySelectorAll('.floating-nav__scene,.motion-rail__label').forEach((el) => {
    el.classList.add('is-changing');
    window.setTimeout(() => {
      el.textContent = name;
      el.classList.remove('is-changing');
    }, 130);
  });
  pulseScene();
}

if ('IntersectionObserver' in window && sceneSections.length) {
  const sceneObserver = new IntersectionObserver((entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!active) return;
    document.body.dataset.scene = active.target.dataset.scene || 'sage';
    updateSceneLabels(sceneNames.get(active.target.id) || 'La Maison');
  }, { threshold: [0.15, 0.35, 0.6] });
  sceneSections.forEach((section) => sceneObserver.observe(section));
}

function installGlobalMotionUI() {
  const nav = document.createElement('div');
  nav.className = 'floating-nav';
  nav.innerHTML = `
    <a class="floating-nav__brand" href="#top">La Maison Malgache</a>
    <span class="floating-nav__divider" aria-hidden="true"></span>
    <span class="floating-nav__scene">${activeSceneName}</span>
    <nav class="floating-nav__links" aria-label="Navigation rapide">
      <a href="#universes">Collections</a>
      <a href="#craft">Savoir-faire</a>
      <a href="#madagascar">Madagascar</a>
    </nav>`;
  document.body.appendChild(nav);

  const rail = document.createElement('div');
  rail.className = 'motion-rail';
  rail.setAttribute('aria-hidden', 'true');
  rail.innerHTML = '<span class="motion-rail__fill"></span><span class="motion-rail__dot"></span><span class="motion-rail__label">Entrée</span>';
  document.body.appendChild(rail);

  const flare = document.createElement('div');
  flare.className = 'motion-flare';
  flare.setAttribute('aria-hidden', 'true');
  document.body.appendChild(flare);

  const speedLines = document.createElement('div');
  speedLines.className = 'motion-speed-lines';
  speedLines.setAttribute('aria-hidden', 'true');
  document.body.appendChild(speedLines);
}

if (!reduceMotion.matches) installGlobalMotionUI();

if (!reduceMotion.matches) {
  let lastY = window.scrollY;
  let lastTime = performance.now();
  let scrollRaf = 0;
  let fastTimer = 0;

  const updateGlobalMotion = () => {
    scrollRaf = 0;
    const now = performance.now();
    const y = window.scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, y / max));
    const dt = Math.max(16, now - lastTime);
    const velocity = (y - lastY) / dt * 16.67;
    const clampedVelocity = Math.max(-42, Math.min(42, velocity));
    const intensity = Math.min(1, Math.abs(clampedVelocity) / 28);

    document.documentElement.style.setProperty('--page-progress', String(progress));
    document.documentElement.style.setProperty('--scroll-velocity', `${clampedVelocity}px`);
    document.documentElement.style.setProperty('--speed-opacity', String(Math.max(0, (intensity - .28) * .22)));

    const hero = document.querySelector('.hero-stage');
    const heroEnd = hero ? hero.offsetTop + hero.offsetHeight * .62 : window.innerHeight;
    document.body.classList.toggle('has-floating-nav', y > heroEnd);
    document.body.classList.toggle('is-scrolling-fast', intensity > .48);

    clearTimeout(fastTimer);
    fastTimer = window.setTimeout(() => {
      document.body.classList.remove('is-scrolling-fast');
      document.documentElement.style.setProperty('--scroll-velocity', '0px');
      document.documentElement.style.setProperty('--speed-opacity', '0');
    }, 120);

    lastY = y;
    lastTime = now;
  };

  const requestGlobalMotion = () => {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(updateGlobalMotion);
  };

  window.addEventListener('scroll', requestGlobalMotion, { passive: true });
  window.addEventListener('resize', requestGlobalMotion);
  updateGlobalMotion();
}

if (!reduceMotion.matches && finePointer.matches) {
  let pointerRaf = 0;
  let pointerX = window.innerWidth * .72;
  let pointerY = window.innerHeight * .28;

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (pointerRaf) return;
    pointerRaf = requestAnimationFrame(() => {
      pointerRaf = 0;
      document.documentElement.style.setProperty('--pointer-x', `${pointerX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${pointerY}px`);
    });
  }, { passive: true });

  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate3d(${x * 0.12}px,${y * 0.12}px,0)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = 'translate3d(0,0,0)';
    });
  });

  const contextualCards = [...document.querySelectorAll('.card[data-reactive]')];
  if (contextualCards.length) {
    document.body.classList.add('has-context-cursor');
    const cursor = document.createElement('div');
    cursor.className = 'context-cursor';
    cursor.textContent = 'Explorer';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);

    let pointerX = -200;
    let pointerY = -200;
    let cursorX = -200;
    let cursorY = -200;
    let cursorRaf = 0;

    const animateCursor = () => {
      cursorRaf = 0;
      cursorX += (pointerX - cursorX) * 0.18;
      cursorY += (pointerY - cursorY) * 0.18;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      if (Math.abs(pointerX - cursorX) > 0.2 || Math.abs(pointerY - cursorY) > 0.2) {
        cursorRaf = requestAnimationFrame(animateCursor);
      }
    };

    const requestCursor = () => {
      if (!cursorRaf) cursorRaf = requestAnimationFrame(animateCursor);
    };

    contextualCards.forEach((card) => {
      card.addEventListener('pointerenter', (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        cursorX = event.clientX;
        cursorY = event.clientY;
        cursor.classList.add('is-visible');
        requestCursor();
      });
      card.addEventListener('pointermove', (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        requestCursor();

        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const ry = (px - 0.5) * 8;
        const rx = (0.5 - py) * 7;
        card.style.setProperty('--rx', `${rx}deg`);
        card.style.setProperty('--ry', `${ry}deg`);
        card.style.setProperty('--px', `${px * 100}%`);
        card.style.setProperty('--py', `${py * 100}%`);
      });
      card.addEventListener('pointerleave', () => {
        cursor.classList.remove('is-visible');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--px', '50%');
        card.style.setProperty('--py', '50%');
      });
    });
  }
}
