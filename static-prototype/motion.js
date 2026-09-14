const storytellingStyles = document.createElement('link');
storytellingStyles.rel = 'stylesheet';
storytellingStyles.href = 'storytelling.css';
document.head.appendChild(storytellingStyles);

const madagascarStyles = document.createElement('link');
madagascarStyles.rel = 'stylesheet';
madagascarStyles.href = 'madagascar-motion.css';
document.head.appendChild(madagascarStyles);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer:fine)');

document.body.classList.add('ready');

function revealImmediately() {
  document.querySelectorAll('.reveal,.line-reveal,.mask-reveal').forEach((el) => el.classList.add('is-visible'));
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

  document.querySelectorAll('.reveal,.line-reveal,.mask-reveal').forEach((el) => revealObserver.observe(el));
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
if ('IntersectionObserver' in window && sceneSections.length) {
  const sceneObserver = new IntersectionObserver((entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (active) document.body.dataset.scene = active.target.dataset.scene || 'sage';
  }, { threshold: [0.15, 0.35, 0.6] });
  sceneSections.forEach((section) => sceneObserver.observe(section));
}

if (!reduceMotion.matches && finePointer.matches) {
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

  document.querySelectorAll('.card[data-reactive]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
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
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--px', '50%');
      card.style.setProperty('--py', '50%');
    });
  });
}
