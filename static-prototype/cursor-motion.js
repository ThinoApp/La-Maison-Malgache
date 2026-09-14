/* Signature cursor physics. This file is concatenated after motion.js for the preview build. */
if (!reduceMotion.matches && finePointer.matches) {
  const cursorStyle = document.createElement('link');
  cursorStyle.rel = 'stylesheet';
  cursorStyle.href = 'cursor-motion.css';
  document.head.appendChild(cursorStyle);

  document.body.classList.add('has-brand-cursor');

  const brandCursor = document.createElement('div');
  brandCursor.className = 'brand-cursor';
  brandCursor.setAttribute('aria-hidden', 'true');
  brandCursor.innerHTML = `
    <span class="brand-cursor__dot"></span>
    <span class="brand-cursor__ring"><span class="brand-cursor__label">Explorer</span></span>`;
  document.body.appendChild(brandCursor);

  const dot = brandCursor.querySelector('.brand-cursor__dot');
  const ring = brandCursor.querySelector('.brand-cursor__ring');
  const label = brandCursor.querySelector('.brand-cursor__label');

  let pointerX = -120;
  let pointerY = -120;
  let previousX = pointerX;
  let previousY = pointerY;
  let ringX = pointerX;
  let ringY = pointerY;
  let stretch = 1;
  let squash = 1;
  let angle = 0;
  let visible = false;
  let cursorRaf = 0;

  const interactiveSelector = 'a,button,[role="button"],input,select,textarea,label';
  const cardSelector = '.card[data-reactive]';

  function setCursorState(target) {
    const card = target.closest(cardSelector);
    const interactive = target.closest(interactiveSelector);

    brandCursor.classList.toggle('is-card', Boolean(card));
    brandCursor.classList.toggle('is-link', Boolean(interactive) && !card);
    label.textContent = card ? 'Explorer' : '';
  }

  function animateBrandCursor() {
    cursorRaf = 0;

    ringX += (pointerX - ringX) * 0.16;
    ringY += (pointerY - ringY) * 0.16;

    const dx = pointerX - previousX;
    const dy = pointerY - previousY;
    const speed = Math.min(18, Math.hypot(dx, dy));
    const targetStretch = 1 + speed * 0.022;
    const targetSquash = 1 - Math.min(.18, speed * 0.008);

    stretch += (targetStretch - stretch) * 0.22;
    squash += (targetSquash - squash) * 0.22;
    if (Math.abs(dx) + Math.abs(dy) > .2) angle = Math.atan2(dy, dx) * 180 / Math.PI;

    dot.style.transform = `translate3d(${pointerX}px,${pointerY}px,0) translate3d(-50%,-50%,0)`;
    ring.style.transform = `translate3d(${ringX}px,${ringY}px,0) translate3d(-50%,-50%,0) rotate(${angle}deg) scaleX(${stretch}) scaleY(${squash})`;

    previousX += (pointerX - previousX) * .55;
    previousY += (pointerY - previousY) * .55;

    const stillMoving = Math.abs(pointerX - ringX) > .08 || Math.abs(pointerY - ringY) > .08 || Math.abs(stretch - 1) > .008 || Math.abs(squash - 1) > .008;
    if (!stillMoving) {
      stretch += (1 - stretch) * .4;
      squash += (1 - squash) * .4;
    }

    if (visible && (stillMoving || Math.abs(stretch - 1) > .004 || Math.abs(squash - 1) > .004)) {
      cursorRaf = requestAnimationFrame(animateBrandCursor);
    }
  }

  function requestBrandCursor() {
    if (!cursorRaf) cursorRaf = requestAnimationFrame(animateBrandCursor);
  }

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;

    if (!visible) {
      visible = true;
      ringX = pointerX;
      ringY = pointerY;
      previousX = pointerX;
      previousY = pointerY;
      brandCursor.classList.add('is-visible');
    }

    setCursorState(event.target);
    requestBrandCursor();
  }, { passive: true });

  window.addEventListener('pointerdown', () => brandCursor.classList.add('is-pressed'), { passive: true });
  window.addEventListener('pointerup', () => brandCursor.classList.remove('is-pressed'), { passive: true });

  document.addEventListener('pointerout', (event) => {
    if (event.relatedTarget) return;
    visible = false;
    brandCursor.classList.remove('is-visible');
  });

  document.addEventListener('pointerover', (event) => setCursorState(event.target), { passive: true });
}
